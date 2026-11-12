//! Positioning and orientation maths for the site. One function per file,
//! re-exported from here.
//!
//! Every function works on one axis and returns a plain number, so calling
//! it from JavaScript allocates nothing. Call it once per axis.

mod ease_toward;
mod glow_target;
mod magnetic_offset;
mod scroll_progress;
mod tilt;

pub use ease_toward::ease_toward;
pub use glow_target::glow_target;
pub use magnetic_offset::magnetic_offset;
pub use scroll_progress::scroll_progress;
pub use tilt::tilt;
