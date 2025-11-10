var sum_to_n_a = function(n) {
    for (var i = n - 1; i > 0; i--) {
        n += i;
    }
    return n;
};

var sum_to_n_b = function(n) {
    if (n === 1) {
        return 1;
    } else {
        return n + sum_to_n_b(n - 1);
    }
};

var sum_to_n_c = function(n) {
    return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, val) => acc + val, 0);
};

