const arti_1_hand = {
    model : parserObjFile(block_obj),
    view  : scaleMatrix(0.1, 0.3, 0.1),
    child : []
};

const arti_1_leg = {
    model : parserObjFile(block_obj),
    view  : scaleMatrix(0.1, 0.3, 0.1),
    child : []
};

const arti_1_head = {
    model : parserObjFile(simple_cube_obj, true),
    view  : scaleMatrix(0.4, 0.4, 0.4),
    child : []
};

const articulated_model_1 = {
    model : parserObjFile(simple_cube_obj, true),
    view  : scaleMatrix(0.4, 0.75, 0.2),
    child : [
        {
            model    : arti_1_head,
            view     : matrixInverse(translationMatrix(0, -0.5, 0)),
            transform: identityMatrix(),
        },
        {
            model    : arti_1_hand,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(0.3, -0.35, 0))),
            transform: identityMatrix(),
        },
        {
            model    : arti_1_hand,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.3, -0.35, 0))),
            transform: identityMatrix(),
        },
        {
            model    : arti_1_leg,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(0.1, 0.4, 0))),
            transform: identityMatrix(),
        },
        {
            model    : arti_1_leg,
            view     :matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.1, 0.4, 0))),
            transform: identityMatrix(),
        },
    ]
};
