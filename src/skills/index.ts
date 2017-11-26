export interface Skill {
    canHandle(message: string): boolean;
    handle(message: string): string;
}

export interface Entity {
    
}

export * from './converse';
export * from './help';
export * from './learn';
export * from './VJ';