const box1 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : matrixInverse(translationMatrix(0, 1.2, 0.0)),
    transform: identityMatrix(),
    child    : []
};

const box2 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : matrixInverse(translationMatrix(1.2, 0, 0)),
    transform: identityMatrix(),
    child    : []
};

const box3 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : matrixInverse(translationMatrix(-1.2, 0, 0)),
    transform: identityMatrix(),
    child    : []
};

const box4 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : matrixInverse(translationMatrix(0, -1.2, 0)),
    transform: identityMatrix(),
    child    : [box3]
};

const articulated_model_1 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : identityMatrix(),
    transform: identityMatrix(),
    child    : [box1, box2, box4]
};
