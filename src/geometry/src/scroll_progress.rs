use wasm_bindgen::prelude::wasm_bindgen;

/// Scroll position as a percentage from 0 to 100.
///
/// `scrolled` is the scroll offset and `scrollable` the total distance
/// that can be scrolled (content height minus viewport height). A page
/// that cannot scroll gives 0.
#[wasm_bindgen]
pub fn scroll_progress(scrolled: f64, scrollable: f64) -> f64 {
    if scrollable <= 0.0 {
        return 0.0;
    }
    scrolled / scrollable * 100.0
}

#[cfg(test)]
mod tests {
    use super::scroll_progress;

    #[test]
    fn maps_the_scroll_range_to_a_percentage() {
        assert_eq!(scroll_progress(0.0, 800.0), 0.0);
        assert_eq!(scroll_progress(200.0, 800.0), 25.0);
        assert_eq!(scroll_progress(800.0, 800.0), 100.0);
    }

    #[test]
    fn is_zero_when_the_page_cannot_scroll() {
        assert_eq!(scroll_progress(0.0, 0.0), 0.0);
        assert_eq!(scroll_progress(10.0, -5.0), 0.0);
    }
}
