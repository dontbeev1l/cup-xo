function random(max, min) {
    if (!min) { min = 0; }
    return Math.round(Math.random() * (max - min) + min);
}