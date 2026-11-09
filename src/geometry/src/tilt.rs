use wasm_bindgen::prelude::wasm_bindgen;

/// Tilt in degrees for a pointer inside a rect, along one axis.
///
/// `start` and `size` are the rect's edge and length on that axis. The
/// result runs from `-max` at the start edge to `max` at the far edge and
/// is 0 at the centre. A zero-length rect gives 0.
#[wasm_bindgen]
pub fn tilt(pointer: f64, start: f64, size: f64, max: f64) -> f64 {
    if size == 0.0 {
        return 0.0;
    }
    ((pointer - start) / size - 0.5) * max
}

#[cfg(test)]
mod tests {
    use super::tilt;

    #[test]
    fn is_zero_at_the_centre() {
        assert_eq!(tilt(150.0, 100.0, 100.0, 3.0), 0.0);
    }

    #[test]
    fn reaches_the_limit_at_each_edge() {
        assert_eq!(tilt(100.0, 100.0, 100.0, 3.0), -1.5);
        assert_eq!(tilt(200.0, 100.0, 100.0, 3.0), 1.5);
    }

    #[test]
    fn flips_with_a_negative_limit() {
        assert_eq!(tilt(200.0, 100.0, 100.0, -3.0), -1.5);
    }

    #[test]
    fn ignores_an_empty_rect() {
        assert_eq!(tilt(5.0, 5.0, 0.0, 3.0), 0.0);
    }
}
