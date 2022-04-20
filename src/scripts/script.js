// IF3260 Grafika Komputer - Tugas Besar 3
var state;
var mouse_state;

function main() {
    // Set state and event listener
    setUIEventListener();
    document.getElementById("reset").click(); // Reset everything to default state

    var transformMatrix;
    var cameraMatrix;

    // -- Ritual WebGL Create Program --
    const canvas = document.getElementById('canvas');
    const gl     = canvas.getContext('webgl');

    if (!gl) {
        alert('Browsermu jelek');
        return;
    }

    var vertexBuffer   = gl.createBuffer();
    var normBuffer     = gl.createBuffer();
    var textBuffer     = gl.createBuffer();
    var textureBuffer  = gl.createTexture();
    var cubemapBuffer  = gl.createTexture();

    var texturedShader = {};
    var cubemapShader  = {};
    var flatShader     = {};
    texturedShader.program = webglCreateShaderProgram(gl, 'vertex-shader-3d', 'fragment-shader-3d-light');
    cubemapShader.program  = webglCreateShaderProgram(gl, 'vertex-shader-3d', 'fragment-shader-3d-cubemap');
    flatShader.program     = webglCreateShaderProgram(gl, 'vertex-shader-3d', 'fragment-shader-3d-flat');

    // -- Create buffer & pointer --
    function getLocation(gl, target) {
        target.coordLoc  = gl.getAttribLocation(target.program, "coordinates");
        target.normLoc   = gl.getAttribLocation(target.program, "a_normal");
        target.textLoc   = gl.getAttribLocation(target.program, "a_texcoord");
        target.trMatLoc  = gl.getUniformLocation(target.program, "transformationMatrix");
        target.colorLoc  = gl.getUniformLocation(target.program, "userColor");
        target.prjMatLoc = gl.getUniformLocation(target.program, "uProjectionMatrix");
        target.prjTrsLoc = gl.getUniformLocation(target.program, "uProjTransMatrix");
        target.lightCoor = gl.getUniformLocation(target.program, "lightCoordinate");
        target.fudgeLoc  = gl.getUniformLocation(target.program, "fudgeFactor");
    }

    getLocation(gl, texturedShader);
    getLocation(gl, cubemapShader);
    getLocation(gl, flatShader);

    window.requestAnimationFrame(render);



    function useTexture(filename) {
        var image = new Image();
        image.src = filename;
        image.addEventListener("load", () => {
            gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
    }

    function loadCubemap() {
        var cubemapFaces = [
            {
                face: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                src : 'pos-x.jpg',
            },
            {
                face: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                src : 'neg-x.jpg',
            },
            {
                face: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                src : 'pos-y.jpg',
            },
            {
                face: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                src : 'neg-y.jpg',
            },
            {
                face: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                src : 'pos-z.jpg',
            },
            {
                face: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
                src : 'neg-z.jpg',
            },
        ];

        cubemapFaces.forEach((metadata) => {
            gl.texImage2D(metadata.face, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            var image = new Image();
            image.src = metadata.src;
            image.addEventListener("load", () => {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapBuffer);
                gl.texImage2D(metadata.face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }

    function flatColorTexture() {
        gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([
                state.pickedColor[0]*255,
                state.pickedColor[1]*255,
                state.pickedColor[2]*255,
                255
            ]
        ));
    }

    function drawArticulatedModel(tree_model, parentView=identityMatrix()) {
        drawModel(tree_model.model, tree_model.view, parentView);

        tree_model.child.forEach((child) => {
            drawArticulatedModel(child.model, matrixMult(parentView, matrixMult(child.view, child.transform)));
        });
    }

    function drawModel(model, transMatrix, viewMatrix) {
        if (state.cubemap)
            var shader = cubemapShader;
        else if (state.useLight)
            var shader = texturedShader;
        else
            var shader = flatShader;

        gl.useProgram(shader.program);

        gl.enableVertexAttribArray(shader.coordLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(shader.coordLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.f_vert), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(shader.normLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
        gl.vertexAttribPointer(shader.normLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.f_norm), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(shader.textLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, textBuffer);
        gl.vertexAttribPointer(shader.textLoc, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.f_text), gl.STATIC_DRAW);

        gl.uniformMatrix4fv(shader.trMatLoc, false, new Float32Array(transMatrix));
        gl.uniformMatrix4fv(shader.prjMatLoc, false, viewMatrix);
        gl.uniformMatrix4fv(shader.prjTrsLoc, false, transposeMatrix(viewMatrix));
        gl.uniform3f(shader.colorLoc, state.pickedColor[0], state.pickedColor[1], state.pickedColor[2]);
        gl.uniform3f(shader.lightCoor, state.lightLocation[0], state.lightLocation[1], state.lightLocation[2]);

        if (state.projectionType === "pers")
            gl.uniform1f(shader.fudgeLoc, 1.275);
        else
            gl.uniform1f(shader.fudgeLoc, 0);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, model.f_vert.length / 3);
    }

    function render(timestamp) {
        let step = timestamp / 1000;
        transformMatrix = computeTransformMatrix();

        if (!mouse_state.dragging) {
            mouse_state.delta.x *= 0.95;
            mouse_state.delta.y *= 0.95;
            state.transformation.rotation[1] -= mouse_state.delta.x;
            state.transformation.rotation[0] -= mouse_state.delta.y;
        }

        if (state.transformation.rotation[0] > Math.PI)
            state.transformation.rotation[0] = -Math.PI;

        if (state.transformation.rotation[1] > Math.PI)
            state.transformation.rotation[1] = -Math.PI;

        var viewMatrix = matrixMult(projectionMatrix(state.projectionType), computeViewMatrix());

        if (state.useAnimation)
            state.articulated_model.animation(step);
        else
            state.articulated_model.animation(0);

        if (!state.texture_loaded) {
            var selectedModelRadio = document.querySelector("input[name='bentuk']:checked").value;
            if (selectedModelRadio == "Steve")
                useTexture("board256.png");
            else if (selectedModelRadio == "Dog") {
                flatColorTexture();
                loadCubemap();
            }
            state.texture_loaded = true;
        }

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        drawArticulatedModel(state.articulated_model, viewMatrix);

        window.requestAnimationFrame(render);
    }
}





// -------------------- Utilities --------------------
function computeTransformMatrix() {
    var transformMatrix;
    var translation = state.transformation.translation;
    var scale       = state.transformation.scale;
    var rotation    = state.transformation.rotation;

    transformMatrix = scaleMatrix(scale[0], scale[1], scale[2]);
    transformMatrix = matrixMult(rotationMatrix(rotation[0], rotation[1], rotation[2]), transformMatrix);
    transformMatrix = matrixMult(translationMatrix(translation[0], translation[1], translation[2]), transformMatrix);
    return transformMatrix;
}

function computeViewMatrix() {
    var viewMatrix;
    viewMatrix = rotationMatrix(0, state.view.rotation * Math.PI / 180, 0);
    viewMatrix = matrixMult(viewMatrix, translationMatrix(0, 0, state.view.radius));
    return matrixInverse(viewMatrix);
}

function setUIEventListener() {
    // -------------------- Model & Projection --------------------
    function callbackModel(e) {
        var selectedModelRadio = document.querySelector("input[name='bentuk']:checked").value;
        state.texture_loaded   = false;
        switch (selectedModelRadio) {
            case "Steve":
                state.articulated_model = articulated_model_1;
                state.cubemap           = false;
                break;
            case "Dog":
                state.articulated_model = articulated_model_2;
                state.cubemap           = true;
                break;
            case "Model 3":
                state.articulated_model = articulated_model_3;
                break;
        }
    }

    document.forms["model"].elements["bentuk"].forEach((item, i) => {
        item.onclick = callbackModel;
    });

    function callbackProjection(e) {
        var selectedModelRadio = document.querySelector("input[name='proyeksi']:checked").value;
        switch (selectedModelRadio) {
            case "orthographic":
                state.projectionType = "orth";
                break;
            case "perspective":
                state.projectionType = "pers";
                break;
        }
    }

    document.forms["model"].elements["proyeksi"].forEach((item, i) => {
        item.onclick = callbackProjection;
    });

    document.getElementById("cam-radius").oninput = function () {
        this.nextElementSibling.value = this.value;
        state.view.radius = parseFloat(this.value);
    };

    document.getElementById("cam-rotation").oninput = function () {
        this.nextElementSibling.value = this.value;
        state.view.rotation = parseFloat(this.value);
    };


    // -------------------- Color & etc --------------------
    // Sumber : Tugas besar 1
    function getColor() {
        const hexToRgb = hex =>
          hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                     ,(m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16))

        var hex = document.getElementById("color_picker").value;
        var rgb = hexToRgb(hex);
        state.pickedColor = [rgb[0]/255, rgb[1]/255, rgb[2]/255, 1.0];
    }

    document.getElementById("color_picker").addEventListener('change', getColor, false);

    function callbackShading(e) {
        state.useLight = document.querySelector("#shading").checked;
    }
    function callbackAnimation(e) {
        state.useAnimation = document.querySelector("#animation").checked;
    }

    document.getElementById("shading").addEventListener('change', callbackShading, false);
    document.getElementById("animation").addEventListener('change', callbackAnimation, false);

    function resetCallback() {
        state = {
            articulated_model: articulated_model_1,

            transformation: {
                translation: [0, 0, 0],
                rotation   : [0, 0, Math.PI / 180 * 30],
                scale      : [1, 1, 1],
                mouseRot   : [0, 0]
            },

            view: {
                rotation: 60,
                radius  : 0.0,
            },

            useLight      : true,
            cubemap       : false,
            lightLocation : [0.0, 0.0, 1.2],
            projectionType: "orth", // orth, obli, pers
            pickedColor   : [1.0, 0.5, 0.0, 1.0],

            useAnimation  : true,
        };

        mouse_state = {
            dragging: false,

            origin: {
                x: undefined,
                y: undefined
            },

            delta: {
                x: 0,
                y: 0,
            },

            constant: {
                x: 2 * Math.PI / document.getElementById('canvas').width,
                y: 2 * Math.PI / document.getElementById('canvas').height
            }
        };
    }

    document.getElementById("reset").addEventListener("click", () => {
        resetCallback();
    });

    function callbackMouseDown(e) {
        mouse_state.dragging = true;
        mouse_state.origin.x = e.pageX;
        mouse_state.origin.y = e.pageY;
        e.preventDefault();
        return false;
    }

    function callbackMouseUp(e) {
        mouse_state.dragging = false;
    }

    function callbackMouseMove(e) {
        if (!mouse_state.dragging)
            return false;

        mouse_state.delta.x = (e.pageX - mouse_state.origin.x) * mouse_state.constant.x;
        mouse_state.delta.y = (e.pageY - mouse_state.origin.y) * mouse_state.constant.y;

        state.transformation.rotation[1] -= mouse_state.delta.x;
        state.transformation.rotation[0] -= mouse_state.delta.y;

        mouse_state.origin.x = e.pageX;
        mouse_state.origin.y = e.pageY;

        e.preventDefault();
    }

    document.getElementById('canvas').addEventListener("mousedown", callbackMouseDown, false);
    document.getElementById('canvas').addEventListener("mouseup", callbackMouseUp, false);
    document.getElementById('canvas').addEventListener("mouseout", callbackMouseUp, false);
    document.getElementById('canvas').addEventListener("mousemove", callbackMouseMove, false);
}





window.onload = main();
