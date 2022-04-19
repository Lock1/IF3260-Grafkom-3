// Helper function
function concatQuadrilateralIndices(target, arr) {
    target.push(arr[0]); target.push(arr[1]); target.push(arr[2]);
    target.push(arr[2]); target.push(arr[3]); target.push(arr[0]);
}

function concatTriangleIndices(target, arr) {
    target.push(arr[0]); target.push(arr[1]); target.push(arr[2]);
}

// function createBox(vp, vn, vs) {
//     var model = {
//         vertices : [],
//         indices  : [],
//         norm_idx : [],
//         text_idx : [],
//         texture  : [],
//         normal   : [],
//         numPoints: 0
//     };
// }



function parserObjFile(file, normalize = false) {
    // Parser helper function
    function getFirstToken(str) {
        var token = "";
        var i     = 0;

        while (i < str.length && str[i] != ' ')
            token = token + str[i++];
        return token;
    }
    function parseVertex(str) {
        var raw_data_str = str.substr(2, str.length);
        var vertex       = [];

        vertex.push(parseFloat(raw_data_str));
        raw_data_str = raw_data_str.substr(raw_data_str.indexOf(' '), raw_data_str.length);
        vertex.push(parseFloat(raw_data_str));
        raw_data_str = raw_data_str.trim();
        raw_data_str = raw_data_str.substr(raw_data_str.indexOf(' '), raw_data_str.length);
        vertex.push(parseFloat(raw_data_str));

        return vertex;
    }
    function parseTexture(str) {
        var raw_data_str = str.substr(3, str.length);
        var texture      = [];

        texture.push(parseFloat(raw_data_str));
        raw_data_str = raw_data_str.trim();
        raw_data_str = raw_data_str.substr(raw_data_str.indexOf(' '), raw_data_str.length);
        texture.push(parseFloat(raw_data_str));

        return texture;
    }
    function parseNormal(str) {
        var raw_data_str = str.substr(2, str.length);
        var normal       = [];

        normal.push(parseFloat(raw_data_str));
        raw_data_str = raw_data_str.trim();
        raw_data_str = raw_data_str.substr(raw_data_str.indexOf(' '), raw_data_str.length);
        normal.push(parseFloat(raw_data_str));
        raw_data_str = raw_data_str.trim();
        raw_data_str = raw_data_str.substr(raw_data_str.indexOf(' '), raw_data_str.length);
        normal.push(parseFloat(raw_data_str));

        return normal;
    }
    function parseSurface(str) {
        var surface = str.substr(2).split(" ");
        var vertices = [];
        var textures = [];
        var normals  = [];

        surface.forEach((item, i) => {
            surface[i] = item.split("/");
            surface[i].forEach((st, j) => {
                switch (j) {
                    case 0:
                        vertices.push(parseInt(st) - 1);
                        break;
                    case 1:
                        textures.push(parseInt(st) - 1);
                        break;
                    case 2:
                        normals.push(parseInt(st) - 1);
                        break;
                }
            });
        });

        if (vertices.length == 4) {
            concatQuadrilateralIndices(model.indices,  vertices);
            concatQuadrilateralIndices(model.text_idx, textures);
            concatQuadrilateralIndices(model.norm_idx,  normals);
            model.numPoints += 6;
        }
        else {
            concatTriangleIndices(model.indices,  vertices);
            concatTriangleIndices(model.text_idx, textures);
            concatTriangleIndices(model.norm_idx,  normals);
            model.numPoints += 3;
        }
    }


    function normalizeLength(target) {
        var max   = target.reduce((a, b) => {return Math.max(a, b);});
        var min   = target.reduce((a, b) => {return Math.min(a, b);});
        var range = max - min;

        target.forEach((item, i) => {
            var normed = (item - min) / range;
            target[i] = normed - 0.5;
        });
    }

    function flattenIndices(dst, src, indices, count_item) {
        indices.forEach((item) => {
            for (let i = 0; i < count_item; i++)
                dst.push(src[3*item+i]);
        });
    }

    function stripElements() {
        delete model.vertices;
        delete model.texture;
        delete model.normal;
        delete model.indices;
        delete model.norm_idx;
        delete model.text_idx;
    }

    var model = {
        vertices : [],
        texture  : [],
        normal   : [],
        indices  : [],
        norm_idx : [],
        text_idx : [],
        f_vert   : [],
        f_text   : [],
        f_norm   : [],
        numPoints: 0
    };

    var temp_line = "";
    for (var i = 0; i < file.length; i++) {
        // Get line
        if (file[i] != '\n')
            temp_line = temp_line + file[i];
        else {
            var first_token = getFirstToken(temp_line);

            if (first_token == "v")
                model.vertices = model.vertices.concat(parseVertex(temp_line));
            else if (first_token == "vt")
                model.texture  = model.texture.concat(parseTexture(temp_line));
            else if (first_token == "vn")
                model.normal   = model.normal.concat(parseNormal(temp_line));
            else if (first_token == "f")
                parseSurface(temp_line);

            temp_line = "";
        }
    }

    flattenIndices(model.f_vert, model.vertices, model.indices, 3);
    flattenIndices(model.f_text, model.texture, model.text_idx, 2);
    flattenIndices(model.f_norm, model.normal,  model.norm_idx, 3);

    stripElements();

    if (normalize)
        normalizeLength(model.f_vert);
    return model;
}
