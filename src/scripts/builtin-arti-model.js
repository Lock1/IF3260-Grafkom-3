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

// -- Articulated Model 4 (Dog) --
const arti_4_hand = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.15, 0.05, 0.05),
    child     : []
};

const arti_4_arm = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.2, 0.1, 0.1),
    child     : [
        {
            model    : arti_4_hand,
            view     : matrixInverse(translationMatrix(0.25, -0.115, 0)),
            transform: identityMatrix(),
        },
    ],
};

const arti_4_leg = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.15, 0.075, 0.1),
    child     : []
};

const arti_4_thigh = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.25, 0.1, 0.1),
    child     : [
        {
            model    : arti_4_leg,
            view     : matrixInverse(translationMatrix(0.25, -0.12, 0)),
            transform: identityMatrix(),
        },
    ],
};

const arti_4_head = {
    model     : parserObjFile(simple_cube_obj, true),
    view      : scaleMatrix(0.4, 0.4, 0.4),
    child     : []
};

const arti_4_tail = {
    model     : parserObjFile(block_obj),
    view      : scaleMatrix(0.25, 0.03, 0.03),
    child     : []
};

const articulated_model_4 = {
    model     : parserObjFile(simple_cube_obj, true),
    view      : scaleMatrix(1.1, 0.4, 0.4),
    animation : (step) => {
        articulated_model_4.child[0].transform = rotationMatrix(0, Math.sin(step*2), Math.sin(step*5));

        //Arm
        articulated_model_4.child[1].transform = rotationMatrix(0, 0, -Math.sin(step*2));
        articulated_model_4.child[2].transform = rotationMatrix(0, 0, Math.sin(step*2));
        arti_4_arm.child[0].transform = rotationMatrix(0, 0, Math.sin(step*5));

        //Thigh
        articulated_model_4.child[3].transform = rotationMatrix(0, 0, -Math.sin(step*2));
        articulated_model_4.child[4].transform = rotationMatrix(0,  0, Math.sin(step*2));
        arti_4_thigh.child[0].transform = rotationMatrix(0, 0, Math.sin(step*5));

        //Tail
        articulated_model_4.child[5].transform = rotationMatrix(Math.sin(step*5), 0, 10);
    },
    child     : [
        {
            model    : arti_4_head,
            view     : matrixInverse(translationMatrix(0.5, -0.35, 0)),
            transform: identityMatrix(),
        },
        {
            model    : arti_4_arm,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(0.45, 0.1, -0.35))),
            transform: identityMatrix(),
        },
        {
            model    : arti_4_arm,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(0.45, 0.1, 0.35))),
            transform: identityMatrix(),
        },
        {
            model    : arti_4_thigh,
            view     : matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.2, 0.1, -0.2))),
            transform: identityMatrix(),
        },
        {
            model    : arti_4_thigh,
            view     :matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.2, 0.1, 0.2))),
            transform: identityMatrix(),
        },
        {
            model    : arti_4_tail,
            view     :matrixInverse(matrixMult(rotationMatrix(Math.PI, 0, 0), translationMatrix(-0.65, 0, 0))),
            transform: identityMatrix(),
        },
    ]
};

