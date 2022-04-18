const box1 = {
    model: simple_cube_obj,
    view : translationMatrix(0, 0.5, 0.5),
    child: []
};

const box2 = {
    model: simple_cube_obj,
    view : translationMatrix(0.5, 0.5, 0),
    child: []
};

const articulated_model_1 = {
    model: simple_cube_obj,
    view : null,
    child: [box1, box2]
};
