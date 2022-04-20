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

    var lightingShaderProgram = webglCreateShaderProgram(gl, 'vertex-shader-3d', 'fragment-shader-3d-light');
    var flatShaderProgram     = webglCreateShaderProgram(gl, 'vertex-shader-3d', 'fragment-shader-3d-flat');

    gl.useProgram(lightingShaderProgram);

    // -- Create buffer & pointer --
    var vertexBuffer   = gl.createBuffer();
    var normBuffer     = gl.createBuffer();
    var textBuffer     = gl.createBuffer();
    var textureBuffer  = gl.createTexture();

    var lightCoordLoc  = gl.getAttribLocation(lightingShaderProgram, "coordinates");
    var lightNormLoc   = gl.getAttribLocation(lightingShaderProgram, "a_normal");
    var lightTextLoc   = gl.getAttribLocation(lightingShaderProgram, "a_texcoord");
    var lightTrMatLoc  = gl.getUniformLocation(lightingShaderProgram, "transformationMatrix");
    var lightColorLoc  = gl.getUniformLocation(lightingShaderProgram, "userColor");
    var lightPrjMatLoc = gl.getUniformLocation(lightingShaderProgram, "uProjectionMatrix");
    var lightPrjTrsLoc = gl.getUniformLocation(lightingShaderProgram, "uProjTransMatrix");
    var lightLightCoor = gl.getUniformLocation(lightingShaderProgram, "lightCoordinate");
    var lightFudgeLoc  = gl.getUniformLocation(lightingShaderProgram, "fudgeFactor");

    var flatCoordLoc  = gl.getAttribLocation(flatShaderProgram, "coordinates");
    var flatNormLoc   = gl.getAttribLocation(flatShaderProgram, "a_normal");
    var flatTextLoc   = gl.getAttribLocation(lightingShaderProgram, "a_texcoord");
    var flatTrMatLoc  = gl.getUniformLocation(flatShaderProgram, "transformationMatrix");
    var flatColorLoc  = gl.getUniformLocation(flatShaderProgram, "userColor");
    var flatPrjMatLoc = gl.getUniformLocation(flatShaderProgram, "uProjectionMatrix");
    var flatPrjTrsLoc = gl.getUniformLocation(flatShaderProgram, "uProjTransMatrix");
    var flatLightCoor = gl.getUniformLocation(flatShaderProgram, "lightCoordinate");
    var flatFudgeLoc  = gl.getUniformLocation(flatShaderProgram, "fudgeFactor");
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
        if (state.useLight) {
            var shaderProgram = lightingShaderProgram;
            var coordLoc      = lightCoordLoc;
            var normLoc       = lightNormLoc;
            var textLoc       = lightTextLoc;
            var trMatLoc      = lightTrMatLoc;
            var colorLoc      = lightColorLoc;
            var projLoc       = lightPrjMatLoc;
            var projTrsLoc    = lightPrjTrsLoc;
            var lightLoc      = lightLightCoor;
            var fudgeLoc      = lightFudgeLoc;
            if (model.articulated_model == articulated_model_1)
                useTexture("board256.png");
        }
        else {
            var shaderProgram = flatShaderProgram;
            var coordLoc      = flatCoordLoc;
            var normLoc       = flatNormLoc;
            var textLoc       = flatTextLoc;
            var trMatLoc      = flatTrMatLoc;
            var colorLoc      = flatColorLoc;
            var projLoc       = flatPrjMatLoc;
            var projTrsLoc    = flatPrjTrsLoc;
            var lightLoc      = flatLightCoor;
            var fudgeLoc      = flatFudgeLoc;
        }

        gl.enableVertexAttribArray(coordLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(coordLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.f_vert), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(normLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
        gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.f_norm), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(textLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, textBuffer);
        gl.vertexAttribPointer(textLoc, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.f_text), gl.STATIC_DRAW);

        gl.uniformMatrix4fv(trMatLoc, false, new Float32Array(transMatrix));
        gl.uniformMatrix4fv(projLoc, false, viewMatrix);
        gl.uniformMatrix4fv(projTrsLoc, false, transposeMatrix(viewMatrix));
        gl.uniform3f(colorLoc, state.pickedColor[0], state.pickedColor[1], state.pickedColor[2]);
        gl.uniform3f(lightLoc, state.lightLocation[0], state.lightLocation[1], state.lightLocation[2]);

        if (state.projectionType === "pers")
            gl.uniform1f(fudgeLoc, 1.275);
        else
            gl.uniform1f(fudgeLoc, 0);

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

        if (state.useLight)
            var shaderProgram = lightingShaderProgram;
        else
            var shaderProgram = flatShaderProgram;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        gl.useProgram(shaderProgram);
        var viewMatrix = matrixMult(projectionMatrix(state.projectionType), computeViewMatrix());

        if (state.useAnimation)
            state.articulated_model.animation(step);
        else
            state.articulated_model.animation(0);

        var selectedModelRadio = document.querySelector("input[name='bentuk']:checked").value;
        if (selectedModelRadio == "Steve") {
            useTexture("board256.png");
        }
        else if (selectedModelRadio == "Dog") {
            flatColorTexture();
            // TODO : TBA
        }

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
        switch (selectedModelRadio) {
            case "Steve":
                state.articulated_model = articulated_model_1;
                break;
            case "Dog":
                state.articulated_model = articulated_model_2;
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
