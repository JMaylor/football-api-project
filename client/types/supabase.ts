export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      competition: {
        Row: {
          competition_code: string
          competition_name: string | null
        }
        Insert: {
          competition_code: string
          competition_name?: string | null
        }
        Update: {
          competition_code?: string
          competition_name?: string | null
        }
        Relationships: []
      }
      deduction: {
        Row: {
          deduction_amount: number
          season_id: number
          team_name: string
        }
        Insert: {
          deduction_amount: number
          season_id: number
          team_name: string
        }
        Update: {
          deduction_amount?: number
          season_id?: number
          team_name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'deduction_season_id_fkey'
            columns: ['season_id']
            isOneToOne: false
            referencedRelation: 'season'
            referencedColumns: ['season_id']
          },
          {
            foreignKeyName: 'deduction_team_name_fkey'
            columns: ['team_name']
            isOneToOne: false
            referencedRelation: 'team'
            referencedColumns: ['team_name']
          },
        ]
      }
      fixture: {
        Row: {
          away_corners: number | null
          away_fouls: number | null
          away_reds: number | null
          away_shots: number | null
          away_shots_on_target: number | null
          away_team_name: string
          away_yellows: number | null
          fixture_date: string
          fixture_id: number
          full_time_away_goals: number
          full_time_home_goals: number
          half_time_away_goals: number | null
          half_time_home_goals: number | null
          home_corners: number | null
          home_fouls: number | null
          home_reds: number | null
          home_shots: number | null
          home_shots_on_target: number | null
          home_team_name: string
          home_yellows: number | null
          referee_name: string | null
          season_id: number
        }
        Insert: {
          away_corners?: number | null
          away_fouls?: number | null
          away_reds?: number | null
          away_shots?: number | null
          away_shots_on_target?: number | null
          away_team_name: string
          away_yellows?: number | null
          fixture_date: string
          fixture_id?: never
          full_time_away_goals: number
          full_time_home_goals: number
          half_time_away_goals?: number | null
          half_time_home_goals?: number | null
          home_corners?: number | null
          home_fouls?: number | null
          home_reds?: number | null
          home_shots?: number | null
          home_shots_on_target?: number | null
          home_team_name: string
          home_yellows?: number | null
          referee_name?: string | null
          season_id: number
        }
        Update: {
          away_corners?: number | null
          away_fouls?: number | null
          away_reds?: number | null
          away_shots?: number | null
          away_shots_on_target?: number | null
          away_team_name?: string
          away_yellows?: number | null
          fixture_date?: string
          fixture_id?: never
          full_time_away_goals?: number
          full_time_home_goals?: number
          half_time_away_goals?: number | null
          half_time_home_goals?: number | null
          home_corners?: number | null
          home_fouls?: number | null
          home_reds?: number | null
          home_shots?: number | null
          home_shots_on_target?: number | null
          home_team_name?: string
          home_yellows?: number | null
          referee_name?: string | null
          season_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'fixture_away_team_name_fkey'
            columns: ['away_team_name']
            isOneToOne: false
            referencedRelation: 'team'
            referencedColumns: ['team_name']
          },
          {
            foreignKeyName: 'fixture_home_team_name_fkey'
            columns: ['home_team_name']
            isOneToOne: false
            referencedRelation: 'team'
            referencedColumns: ['team_name']
          },
          {
            foreignKeyName: 'fixture_referee_name_fkey'
            columns: ['referee_name']
            isOneToOne: false
            referencedRelation: 'referee'
            referencedColumns: ['referee_name']
          },
          {
            foreignKeyName: 'fixture_season_id_fkey'
            columns: ['season_id']
            isOneToOne: false
            referencedRelation: 'season'
            referencedColumns: ['season_id']
          },
        ]
      }
      referee: {
        Row: {
          referee_name: string
        }
        Insert: {
          referee_name: string
        }
        Update: {
          referee_name?: string
        }
        Relationships: []
      }
      season: {
        Row: {
          competition_code: string
          season_id: number
          season_name: string
        }
        Insert: {
          competition_code: string
          season_id?: never
          season_name: string
        }
        Update: {
          competition_code?: string
          season_id?: never
          season_name?: string
        }
        Relationships: [
          {
            foreignKeyName: 'season_competition_code_fkey'
            columns: ['competition_code']
            isOneToOne: false
            referencedRelation: 'competition'
            referencedColumns: ['competition_code']
          },
        ]
      }
      team: {
        Row: {
          team_name: string
        }
        Insert: {
          team_name: string
        }
        Update: {
          team_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      season_table: {
        Args: {
          p_season_id: number
        }
        Returns: {
          team_name: string
          played: number
          won: number
          drawn: number
          lost: number
          goals_for: number
          goals_against: number
          goal_difference: number
          points: number
          deductions: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database['public']['Tables'] & Database['public']['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
  Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
  Database['public']['Views'])
    ? (Database['public']['Tables'] &
    Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database['public']['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database['public']['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database['public']['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
