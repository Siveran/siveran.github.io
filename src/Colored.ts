/**
 * ...
 * @author Siveran
 */
export class Colored {
	public red: number;
	public green: number;
	public blue: number;
	public white: number;
	
	public constructor(red: number, green: number, blue: number, white: number) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.white = white;
	}
	
	public map(func: (t: number) => number): Colored {
		return new Colored(func(this.red), func(this.green), func(this.blue), func(this.white));
	}
	
	public zipMap(other: Colored, func: (t: number, u: number) => number): Colored {
		return new Colored(func(this.red, other.red), func(this.green, other.green), func(this.blue, other.blue), func(this.white, other.white));
	}
	
	
	public countNonZero(): number {
		return (this.red > 0 ? 1 : 0) + (this.green > 0 ? 1 : 0) + (this.blue > 0 ? 1 : 0) + (this.white > 0 ? 1 : 0);
	}
	
	public total(): number {
		return this.red + this.green + this.blue + this.white;
	}
	
	public toString(): String {
		return "Red: " + this.red + " | Green: " + this.green + " | Blue: " + this.blue + " | White: " + this.white;
	}
	
	public add(other: Colored) {
		return new Colored(this.red + other.red, this.green + other.green, this.blue + other.blue, this.white + other.white);
	}
	
	public subtract(other: Colored) {
		return new Colored(this.red - other.red, this.green - other.green, this.blue - other.blue, this.white - other.white);
	}
	
	public set(red: number, green: number, blue: number, white: number) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.white = white;
	}
}