AXIS_LEN = 600;

document.getElementById("nnGraph").style.width = `${AXIS_LEN}px`;
document.getElementById("nnGraph").style.height = `${AXIS_LEN}px`;

drawPoint = (input, color) => {
    point = { x: input[0], y: input[1] };
    let pt = document.createElement("div");
    pt.style.width = "10px";
    pt.style.height = "10px";
    pt.style.borderRadius = "10px";
    pt.style.background = color;
    pt.style.position = "absolute";
    pt.style.left = `${point.x}px`;
    pt.style.bottom = `${point.y}px`;
    document.getElementById("nnGraph").appendChild(pt);
};

document.getElementById("nnGraph").style.marginLeft = `${AXIS_LEN}px`;

drawLine = position => {
    let line = document.createElement("div");
    line.style.position = "absolute";
    line.style.borderTop = "1px solid red";
    line.style.width = `${AXIS_LEN}px`;
    line.style[position] = "0px";
    position == "left"
        ? (line.style.bottom = "0px")
        : position == "right"
        ? (line.style.bottom = "1px")
        : "";
    position == "left"
        ? (line.style.transform = "rotate(180deg)")
        : position == "right"
        ? (line.style.transform = "rotate(360deg)")
        : (line.style.transform = "rotate(90deg)");

    line.style.transformOrigin = "0% 0%";
    document.getElementById("nnGraph").appendChild(line);
};

drawLine("top");
drawLine("bottom");
drawLine("left");
drawLine("right");

const RED = "#e74c3c";
const GREEN = "#2ecc71";
const GREY = "#888";

cluster_origin_red = AXIS_LEN / 2;
cluster_origin_green = (AXIS_LEN / 2) * -1;

lineFunc = x => {
    let m = -1;
    let c = 0;
    return m * x + c;
};

let line_start = { x: AXIS_LEN * -1, y: lineFunc(AXIS_LEN * -1) };
let line_end = { x: AXIS_LEN, y: lineFunc(AXIS_LEN) };
drawLine(line_start, line_end);

drawGradientLine = () => {
    let line = document.createElement("div");
    line.style.position = "absolute";
    line.style.borderTop = "2px solid black";
    line.style.width = `${Math.sqrt(AXIS_LEN * AXIS_LEN + AXIS_LEN * AXIS_LEN) *
        2}px`;
    line.style.top = "0px";
    line.style.left = `-${AXIS_LEN}px`;

    line.style.transform = "rotate(45deg)";
    line.style.transformOrigin = "0% 0%";
    document.getElementById("nnGraph").appendChild(line);
};

drawGradientLine();

cluster = (size, bias) => {
    const rnd = Math.random() * size;
    const mix = Math.random() * 2.5;
    return rnd * (1 - mix) + bias * mix;
};

genInput = origin => [
    cluster(origin * 2.5, origin),
    cluster(origin * 2.5, origin)
];

test_set_red = [...Array(500)].map(_ => genInput(cluster_origin_red));
test_set_green = [...Array(500)].map(_ => genInput(cluster_origin_green));

weights = [Math.random() * 2 - 1, Math.random() * 2 - 1];

sign = input => (input >= 0 ? 1 : 0);

predict = (weights, input) => {
    // Sum(xi.wi) + b
    const sum = weights[0] * input[0] + weights[1] * input[1];
    const bias = 300;
    // sigmoid as the activation function
    const activation = sign(sum + bias);
    const prediction = activation === 1 ? "RED" : "GREEN";
    return prediction;
};

train = (weights, input, actual, lr = 0.01) => {
    const actualValue = actual == "RED" ? 1 : -1;
    const prediction = predict(weights, point);
    const prediction_value = prediction == "RED" ? 1 : -1;
    const error = actualValue - prediction_value;
    return [
        weights[0] + input[0] * error * lr,
        weights[1] + input[1] * error * lr
    ];
};

trainedWeights = weights => {
    const actual = Math.random() * 2 - 1 > 0 ? "RED" : "GREEN";
    test =
        actual == "RED"
            ? genInput(cluster_origin_red)
            : genInput(cluster_origin_green);
    weights = train(weights, test, actual);
    return weights;
};

test_set = [...test_set_green, ...test_set_red];

makePrediction = () => {
    count = 0;
    let interval = setInterval(() => {
        count++;

        test_set.forEach(input => {
            predict(weights, input) === "RED"
                ? drawPoint(input, RED)
                : drawPoint(input, GREEN);
        });
        weights = trainedWeights(weights);
        if (count == 100) {
            clearInterval(interval);
        }
    }, 1000);
};

// PREDICTION
makePrediction();

// ACTUALS
// test_set_green.forEach(input => drawPoint(input, GREEN));
// test_set_red.forEach(input => drawPoint(input, RED));
