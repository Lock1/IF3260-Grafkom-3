// Helper function
function concatQuadrilateralIndices(target, arr) {
    target.push(arr[0]); target.push(arr[1]); target.push(arr[2]);
    target.push(arr[2]); target.push(arr[3]); target.push(arr[0]);
}

function concatTriangleIndices(target, arr) {
    target.push(arr[0]); target.push(arr[1]); target.push(arr[2]);
}

// function createCube(a, b, c) {
//     var model = {
//         vertices : [],
//         indices  : [],
//         norm_idx : [],
//         text_idx : [],
//         texture  : [],
//         normal   : [],
//         numPoints: 0
//     };
//
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
        raw_data_str = raw_data_str.substr(raw_data_str.indexOf(' '), raw_data_str.length);
        raw_data_str = raw_data_str.trim();
        texture.push(parseFloat(raw_data_str));

        return texture;
    }
    function parseNormal(str) {
        var raw_data_str = str.substr(2, str.length);
        var normal       = [];

        normal.push(parseFloat(raw_data_str));
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


    function normalizeLength() {
        var max   = model.vertices.reduce((a, b) => {return Math.max(a, b);});
        var min   = model.vertices.reduce((a, b) => {return Math.min(a, b);});
        var range = max - min;

        model.vertices.forEach((item, i) => {
            var normed = (item - min) / range;
            model.vertices[i] = normed - 0.5;
        });
    }

    var model = {
        vertices : [],
        indices  : [],
        norm_idx : [],
        text_idx : [],
        texture  : [],
        normal   : [],
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

    if (normalize)
        normalizeLength();
    return model;
}
