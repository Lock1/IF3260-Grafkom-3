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
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.1, 0.4, 0))),
            transform: identityMatrix(),
        },
    ]
};

// -- Articulated Model 2 (Dog) --
const arti_2_hand = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.15, 0.05, 0.05),
    child     : []
};

const arti_2_arm = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.2, 0.1, 0.1),
    child     : [
        {
            model    : arti_2_hand,
            view     : matrixInverse(translationMatrix(0.25, -0.115, 0)),
            transform: identityMatrix(),
        },
    ],
};

const arti_2_leg = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.15, 0.075, 0.1),
    child     : []
};

const arti_2_thigh = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.25, 0.1, 0.1),
    child     : [
        {
            model    : arti_2_leg,
            view     : matrixInverse(translationMatrix(0.25, -0.12, 0)),
            transform: identityMatrix(),
        },
    ],
};

const arti_2_head = {
    model     : parserObjFile(simple_cube_obj, true),
    view      : scaleMatrix(0.4, 0.4, 0.4),
    child     : []
};

const arti_2_tail = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.25, 0.03, 0.03),
    child     : []
};

const articulated_model_2 = {
    model     : parserObjFile(simple_cube_obj, true),
    view      : scaleMatrix(1.1, 0.4, 0.4),
    animation : (step) => {
        articulated_model_2.child[0].transform = rotationMatrix(0, Math.sin(step*2), Math.sin(step*5));

        // Arm
        articulated_model_2.child[1].transform = rotationMatrix(0, 0, -Math.sin(step*2));
        articulated_model_2.child[2].transform = rotationMatrix(0, 0, Math.sin(step*2));
        arti_2_arm.child[0].transform = rotationMatrix(0, 0, Math.sin(step*5));

        // Thigh
        articulated_model_2.child[3].transform = rotationMatrix(0, 0, -Math.sin(step*2));
        articulated_model_2.child[4].transform = rotationMatrix(0,  0, Math.sin(step*2));
        arti_2_thigh.child[0].transform = rotationMatrix(0, 0, Math.sin(step*5));

        // Tail
        articulated_model_2.child[5].transform = rotationMatrix(Math.sin(step*5), 0, 10);
    },
    child     : [
        {
            model    : arti_2_head,
            view     : matrixInverse(translationMatrix(0.5, -0.35, 0)),
            transform: identityMatrix(),
        },
        {
            model    : arti_2_arm,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(0.45, 0.1, -0.35))),
            transform: identityMatrix(),
        },
        {
            model    : arti_2_arm,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(0.45, 0.1, 0.35))),
            transform: identityMatrix(),
        },
        {
            model    : arti_2_thigh,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.2, 0.1, -0.2))),
            transform: identityMatrix(),
        },
        {
            model    : arti_2_thigh,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.2, 0.1, 0.2))),
            transform: identityMatrix(),
        },
        {
            model    : arti_2_tail,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.65, 0, 0))),
            transform: identityMatrix(),
        },
    ]
};
