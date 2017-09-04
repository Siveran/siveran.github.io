package;

/**
 * ...
 * @author Summoned
 */
class Colored<T:Float> {
	public var red: T;
	public var green: T;
	public var blue: T;
	
	public function new(red: T, green: T, blue: T) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}
	
	public function map<U:Float>(func: T -> U): Colored<U> {
		return new Colored<U>(func(red), func(green), func(blue));
	}
	
	public function zipMap<U:Float, V:Float>(other: Colored<U>, func: T -> U -> V): Colored<V> {
		return new Colored<V>(func(red, other.red), func(green, other.green), func(blue, other.blue));
	}
	
	
	public function countNonZero(): Int {
		return (red > 0 ? 1 : 0) + (green > 0 ? 1 : 0) + (blue > 0 ? 1 : 0);
	}
	
	public function total(): T {
		return red + green + blue;
	}
	
	public function toString(): String {
		return "Red: " + red + " | Green: " + green + " | Blue: " + blue;
	}
	
	public function add(other: Colored<T>) {
		this.red += other.red;
		this.green += other.green;
		this.blue += other.blue;
	}
	
	public function set(red: T, green: T, blue: T) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}
}