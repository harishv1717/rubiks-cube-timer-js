export default function cube(scramble, size = "3x3x3") {
    const baseURL = `https://puzzle-generator.robiningelbrecht.be/cube?cube[size]=${size.slice(
        0,
        1
    )}&cube[algorithm]=${encodeURIComponent(`x2 ${scramble} x2`)}`;

    const white = `${baseURL}&rotations[0][axis]=x&rotations[0][value]=90`;
    const orange = `${baseURL}&rotations[0][axis]=y&rotations[0][value]=-90&rotations[1][axis]=x&rotations[1][value]=180`;
    const green = `${baseURL}&rotations[0][axis]=y&rotations[0][value]=180&rotations[1][axis]=z&rotations[1][value]=180`;
    const red = `${baseURL}&rotations[0][axis]=y&rotations[0][value]=90&rotations[1][axis]=x&rotations[1][value]=180`;
    const blue = `${baseURL}&rotations[1][axis]=z&rotations[1][value]=180`;
    const yellow = `${baseURL}&rotations[0][axis]=x&rotations[0][value]=-90`;

    return [white, orange, green, red, blue, yellow];
}
