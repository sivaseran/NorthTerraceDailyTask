// One report-oriented classification shared across General, Staff and Manager.
// Derive a label for historical tasks that predate the structured reportCategory field.
export function reportCategoryForTask(task){
  if(task?.reportCategory)return String(task.reportCategory);
  if(task?.hotFood===true)return 'Hot Food';
  if(task?.specialType==='cleaning')return 'Cleaning';
  if(task?.specialType==='compliance'){
    if(task.complianceType==='temperature')return 'Temperature Log';
    if(task.complianceType==='daily')return 'Daily Safety';
    if(task.complianceType==='weekly')return 'Weekly Safety';
    if(String(task.complianceType).startsWith('sfbb'))return 'SFBB';
  }
  return 'Daily Operations';
}
