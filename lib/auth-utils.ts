/**
 * Authentication and Authorization Utilities
 * Handles roles, permissions, and sharing functionality
 */

export type UserRole = "admin" | "spectator" | "team";

export interface TournamentAccess {
  tournamentId: number;
  userId: number;
  role: UserRole;
  canEdit: boolean;
  canDelete: boolean;
  canViewResults: boolean;
  canViewStandings: boolean;
}

/**
 * Generate a unique 4-character alphanumeric admin password
 * Format: lowercase letters and numbers (e.g., "2b4k")
 */
export function generateAdminPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 4; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Generate a unique spectator code for sharing
 * Format: 8-character alphanumeric (e.g., "a1b2c3d4")
 */
export function generateSpectatorCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate admin password
 */
export function validateAdminPassword(password: string, adminPassword: string): boolean {
  return password === adminPassword;
}

/**
 * Get permissions for a user role
 */
export function getRolePermissions(role: UserRole): TournamentAccess {
  const baseAccess = {
    tournamentId: 0,
    userId: 0,
    role,
    canEdit: false,
    canDelete: false,
    canViewResults: true,
    canViewStandings: true,
  };

  switch (role) {
    case "admin":
      return {
        ...baseAccess,
        canEdit: true,
        canDelete: true,
      };
    case "spectator":
      return {
        ...baseAccess,
        canViewResults: true,
        canViewStandings: true,
      };
    case "team":
      return {
        ...baseAccess,
        canEdit: false,
        canViewResults: true,
        canViewStandings: true,
      };
    default:
      return baseAccess;
  }
}

/**
 * Generate share link for tournament
 */
export function generateShareLink(
  baseUrl: string,
  spectatorCode: string
): string {
  return `${baseUrl}/tournament/${spectatorCode}`;
}

/**
 * Generate WhatsApp share message
 */
export function generateWhatsAppMessage(
  tournamentName: string,
  shareLink: string
): string {
  return `¡Únete al torneo "${tournamentName}" en Torneo Manager Pro! 🏆⚽\n\n${shareLink}\n\nVe los resultados, la clasificación y sigue cada jornada en tiempo real.`;
}

/**
 * Generate email share message
 */
export function generateEmailMessage(
  tournamentName: string,
  shareLink: string
): { subject: string; body: string } {
  return {
    subject: `Invitación: ${tournamentName} en Torneo Manager Pro`,
    body: `¡Hola!\n\nTe invito a seguir el torneo "${tournamentName}" en Torneo Manager Pro.\n\nEnlace: ${shareLink}\n\nPuedes ver los resultados, la clasificación y seguir cada jornada en tiempo real.\n\n¡Que disfrutes!`,
  };
}

/**
 * Check if user can perform action
 */
export function canPerformAction(
  access: TournamentAccess,
  action: "edit" | "delete" | "viewResults" | "viewStandings"
): boolean {
  switch (action) {
    case "edit":
      return access.canEdit;
    case "delete":
      return access.canDelete;
    case "viewResults":
      return access.canViewResults;
    case "viewStandings":
      return access.canViewStandings;
    default:
      return false;
  }
}
