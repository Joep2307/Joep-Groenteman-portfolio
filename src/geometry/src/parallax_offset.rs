use wasm_bindgen::prelude::wasm_bindgen;

/// How far something should drift for a pointer in the viewport, along
/// one axis.
///
/// `viewport` is the window's length on that axis and `range` the total
/// travel, so the result runs from `-range / 2` to `range / 2`. A
/// zero-length viewport gives 0.
#[wasm_bindgen]
pub fn parallax_offset(pointer: f64, viewport: f64, range: f64) -> f64 {
    if viewport == 0.0 {
        return 0.0;
    }
    (pointer / viewport - 0.5) * range
}

#[cfg(test)]
mod tests {
    use super::parallax_offset;

    #[test]
    fn is_zero_at_the_middle() {
        assert_eq!(parallax_offset(500.0, 1000.0, 420.0), 0.0);
    }

    #[test]
    fn spans_half_the_range_each_way() {
        assert_eq!(parallax_offset(0.0, 1000.0, 420.0), -210.0);
        assert_eq!(parallax_offset(1000.0, 1000.0, 420.0), 210.0);
    }

    #[test]
    fn ignores_an_empty_viewport() {
        assert_eq!(parallax_offset(10.0, 0.0, 420.0), 0.0);
    }
}
