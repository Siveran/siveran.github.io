/**
 * ...
 * @author Siveran
 */
export class Colored {
	public red: number;
	public green: number;
	public blue: number;
	public white: number;
	
	public constructor(red: number, green: number, blue: number) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.white = red; // TODO: Make white a fourth color
	}
	
	public map(func: (t: number) => number): Colored {
		return new Colored(func(this.red), func(this.green), func(this.blue));
	}
	
	public zipMap(other: Colored, func: (t: number, u: number) => number): Colored {
		return new Colored(func(this.red, other.red), func(this.green, other.green), func(this.blue, other.blue));
	}
	
	
	public countNonZero(): number {
		return (this.red > 0 ? 1 : 0) + (this.green > 0 ? 1 : 0) + (this.blue > 0 ? 1 : 0);
	}
	
	public total(): number {
		return this.red + this.green + this.blue;
	}
	
	public toString(): String {
		return "Red: " + this.red + " | Green: " + this.green + " | Blue: " + this.blue;
	}
	
	public add(other: Colored) {
		this.red += other.red;
		this.green += other.green;
		this.blue += other.blue;
	}
	
	public set(red: number, green: number, blue: number) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}
}