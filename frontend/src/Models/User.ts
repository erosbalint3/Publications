import { Jogosultsag } from "../Enums/Jogosultsag";

export interface User {
    felhasznalonev: string;
    vezeteknev: string;
    keresztnev: string;
    email: string;
    jelszo: string;
    jogosultsag: Jogosultsag;
}