declare module 'react-country-state-city' {
    interface Country {
        id: string;
        name: string;
        isoCode: string;
    }

    interface State {
        id: string;
        name: string;
        isoCode: string;
        countryCode: string;
    }

    interface City {
        id: string;
        name: string;
        stateCode: string;
        countryCode: string;
    }

    export function GetCountries(): Promise<Country[]>;
    export function GetState(countryId: string | number): Promise<State[]>;
    export function GetCity(countryId: string | number, stateId: string | number): Promise<City[]>;
    export function GetLanguages(): Promise<any[]>;
}
