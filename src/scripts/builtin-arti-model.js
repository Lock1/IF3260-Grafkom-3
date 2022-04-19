const box1 = {
    model    : parserObjFile(tetrahedral_obj, true),
    view     : matrixInverse(translationMatrix(0, 0, -1.2)),
    transform: scaleMatrix(0.1, 0.1, 0.1),
    child    : []
};

const box2 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : matrixInverse(translationMatrix(0, 0, 1.2)),
    transform: scaleMatrix(0.2, 0.2, 0.2),
    child    : []
};

const box3 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : matrixInverse(translationMatrix(-1.2, 0, 0)),
    transform: scaleMatrix(0.3, 0.3, 0.3),
    child    : [box1, box2]
};

const box4 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : matrixInverse(translationMatrix(0, -1.2, 0)),
    transform: scaleMatrix(0.4, 0.4, 0.4),
    child    : [box3]
};

const articulated_model_1 = {
    model    : parserObjFile(icosahedron_obj, true),
    view     : identityMatrix(),
    transform: identityMatrix(),
    child    : [box4]
};
