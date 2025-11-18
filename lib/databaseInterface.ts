export interface DatabaseTask {
  task_id: number;
  care_group_id: number;
  title: string;
  description: string | null;
  frequency: string;
  category: string;
  begin_time: string; // Assuming 'YYYY-MM-DD HH:mm:ss'
  end_time: string;
  done: boolean | number;
  assigned_to: string;
}