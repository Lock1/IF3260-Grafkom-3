// -- Articulated Model 1 --
const arti_1_hand = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.1, 0.3, 0.1),
    child     : []
};

const arti_1_leg = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.1, 0.3, 0.1),
    child     : []
};

const arti_1_head = {
    model     : parserObjFile(simple_cube_obj, true),
    view      : scaleMatrix(0.4, 0.4, 0.4),
    child     : []
};

const articulated_model_1 = {
    model     : parserObjFile(simple_cube_obj, true),
    view      : scaleMatrix(0.4, 0.75, 0.2),
    animation : (step) => {
        articulated_model_1.child[2].transform = rotationMatrix(Math.sin(step*5),  0, 0);
        articulated_model_1.child[4].transform = rotationMatrix(Math.sin(step*5),  0, 0);
        articulated_model_1.child[1].transform = rotationMatrix(-Math.sin(step*5), 0, 0);
        articulated_model_1.child[3].transform = rotationMatrix(-Math.sin(step*5), 0, 0);
    },
    child     : [
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


// -- Articulated Model 2 --
const articulated_model_2 = {
    model     : parserObjFile(simple_cube_obj, true),
    view      : scaleMatrix(0.4, 0.75, 0.2),
    animation : (step) => {
        articulated_model_2.child[2].transform = rotationMatrix(Math.sin(step*5),  0, 0);
        articulated_model_2.child[1].transform = rotationMatrix(-Math.sin(step*5), 0, 0);
    },
    child     : [
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
    ]
};

// -- Articulated Model 3 --
const articulated_model_3 = {
    model     : parserObjFile(simple_cube_obj, true),
    view      : scaleMatrix(0.4, 0.75, 0.2),
    animation : (step) => {

    },
    child     : [
        {
            model    : arti_1_head,
            view     : matrixInverse(translationMatrix(0, -0.5, 0)),
            transform: identityMatrix(),
        },
    ]
};
