use wasm_bindgen::prelude::wasm_bindgen;

/// One easing step: moves `current` the fraction `factor` of the way to
/// `target`.
#[wasm_bindgen]
pub fn ease_toward(current: f64, target: f64, factor: f64) -> f64 {
    current + (target - current) * factor
}

#[cfg(test)]
mod tests {
    use super::ease_toward;

    #[test]
    fn moves_a_fraction_of_the_way() {
        assert_eq!(ease_toward(0.0, 100.0, 0.12), 12.0);
        assert_eq!(ease_toward(100.0, 0.0, 0.5), 50.0);
    }

    #[test]
    fn stays_put_at_the_target() {
        assert_eq!(ease_toward(40.0, 40.0, 0.12), 40.0);
    }

    #[test]
    fn converges_on_the_target() {
        let mut value = 0.0;
        for _ in 0..200 {
            value = ease_toward(value, 100.0, 0.12);
        }
        assert!((value - 100.0).abs() < 1e-6);
    }
}
