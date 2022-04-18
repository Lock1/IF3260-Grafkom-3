const box1 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : translationMatrix(0, 2.0, 0.5),
    transform: identityMatrix(),
    child    : []
};

const box2 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : translationMatrix(2.0, 0.5, 0),
    transform: identityMatrix(),
    child    : []
};

const articulated_model_1 = {
    model    : parserObjFile(simple_cube_obj, true),
    view     : identityMatrix(),
    transform: identityMatrix(),
    child    : [box1, box2]
};
