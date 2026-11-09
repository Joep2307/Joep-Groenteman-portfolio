use wasm_bindgen::prelude::wasm_bindgen;

/// Translation in pixels that pulls an element toward the pointer, along
/// one axis.
///
/// `start` and `size` are the element's edge and length on that axis; the
/// pointer's distance from the centre is scaled by `factor`.
#[wasm_bindgen]
pub fn magnetic_offset(
    pointer: f64,
    start: f64,
    size: f64,
    factor: f64,
) -> f64 {
    (pointer - (start + size / 2.0)) * factor
}

#[cfg(test)]
mod tests {
    use super::magnetic_offset;

    #[test]
    fn is_zero_at_the_centre() {
        assert_eq!(magnetic_offset(150.0, 100.0, 100.0, 0.18), 0.0);
    }

    #[test]
    fn scales_the_distance_from_the_centre() {
        assert_eq!(magnetic_offset(200.0, 100.0, 100.0, 0.5), 25.0);
        assert_eq!(magnetic_offset(100.0, 100.0, 100.0, 0.5), -25.0);
    }
}
