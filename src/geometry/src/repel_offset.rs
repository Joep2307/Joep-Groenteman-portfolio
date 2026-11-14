use wasm_bindgen::prelude::wasm_bindgen;

/// How far a shape is pushed away from the pointer, along one axis.
///
/// `along` and `across` are the shape's centre minus the pointer, on this
/// axis and on the other one. The push is `max` with the pointer on the
/// centre's doorstep and fades to nothing at `reach`. A pointer exactly on
/// the centre has no direction to push in and gives 0.
#[wasm_bindgen]
pub fn repel_offset(along: f64, across: f64, reach: f64, max: f64) -> f64 {
    let distance = along.hypot(across);
    if distance == 0.0 || distance >= reach {
        return 0.0;
    }
    along / distance * max * (1.0 - distance / reach)
}

#[cfg(test)]
mod tests {
    use super::repel_offset;

    #[test]
    fn pushes_away_from_the_pointer() {
        assert_eq!(repel_offset(100.0, 0.0, 200.0, 40.0), 20.0);
        assert_eq!(repel_offset(-100.0, 0.0, 200.0, 40.0), -20.0);
    }

    #[test]
    fn splits_the_push_between_the_axes() {
        assert_eq!(repel_offset(60.0, 80.0, 200.0, 40.0), 12.0);
        assert_eq!(repel_offset(80.0, 60.0, 200.0, 40.0), 16.0);
    }

    #[test]
    fn fades_out_at_its_reach() {
        assert_eq!(repel_offset(200.0, 0.0, 200.0, 40.0), 0.0);
        assert_eq!(repel_offset(500.0, 0.0, 200.0, 40.0), 0.0);
    }

    #[test]
    fn has_no_direction_on_the_centre() {
        assert_eq!(repel_offset(0.0, 0.0, 200.0, 40.0), 0.0);
    }
}
