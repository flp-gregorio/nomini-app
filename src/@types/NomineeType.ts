// ----------------------------------------------------------------------
// Users & Auth
// Matches your Prisma User model
// ----------------------------------------------------------------------
export type User = {
  id: number;           // Changed from string to number (per your Prisma schema: id Int)
  email: string;
  username: string;
  password?: string;    // Optional for frontend security
  votes?: Vote[];       // Optional relationship
  // isAdmin is not in your Prisma schema, but if you handle it via username check or separate logic, keep it.
  isAdmin?: boolean;    
};

// ----------------------------------------------------------------------
// Categories
// Sourced from API (reading data.json)
// ----------------------------------------------------------------------
export type Category = {
  id: number;          // Generated index from the API
  title: string;       // Key from data.json (e.g., "Game of the Year")
  description: string; // Description from data.json
  weight?: number;     // Optional weight from data.json
  nominees?: Nominee[];
};

// ----------------------------------------------------------------------
// Nominees
// Sourced from API (reading data.json)
// ----------------------------------------------------------------------
export type Nominee = {
  id: number;          // Generated index
  name: string;        // Mapped from "Nominee" in JSON
  publisher: string;   // Mapped from "Publisher" in JSON
  genre: string;       // Mapped from "Genre" in JSON
  image: string;       // Mapped from "Image" in JSON
  description?: string; // Optional (Not all nominees have one)
  
  // Winner Status (from data.json)
  Winner?: boolean;    // Capitalized in JSON
  winner?: boolean;    // Lowercase fallback

  // Optional: If you still have code referencing votes, keep this optional
  votes?: number;
};

// ----------------------------------------------------------------------
// Votes
// Matches your Prisma Vote model
// ----------------------------------------------------------------------
export type Vote = {
  id: number;
  userId: number;       // Changed from string to number (per your Prisma schema)
  category: string;     // Stored as String in DB
  nominee: string;      // Stored as String in DB
};