const arti_1_hand = {
    model    : parserObjFile(simple_cube_obj, true),
    transform: scaleMatrix(0.2, 0.7, 0.2),
    child    : []
};

const arti_1_leg = {
    model    : parserObjFile(simple_cube_obj, true),
    transform: scaleMatrix(0.2, 0.6, 0.2),
    child    : []
};

const arti_1_head = {
    model    : parserObjFile(simple_cube_obj, true),
    transform: scaleMatrix(0.4, 0.4, 0.4),
    child    : []
};

const articulated_model_1 = {
    model    : parserObjFile(simple_cube_obj, true),
    transform: scaleMatrix(0.4, 0.75, 0.2),
    child    : [
        [arti_1_head, matrixInverse(translationMatrix(0, -0.5, 0))],
        [arti_1_hand, matrixInverse(translationMatrix(0.3, 0, 0))],
        [arti_1_hand, matrixInverse(translationMatrix(-0.3, 0, 0))],
        [arti_1_leg,  matrixInverse(translationMatrix(0.1, 0.65, 0))],
        [arti_1_leg,  matrixInverse(translationMatrix(-0.1, 0.65, 0))],
    ]
};
