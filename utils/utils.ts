
export interface taskInterface {
  userId : string,
  _id : string,
  isCompleted : boolean,
  description : string,
  taskDeadline : Date
}

export function findTotalTasks(userTasks : [taskInterface]){
   return userTasks.length;
}

export function findCompletedTasks(userTasks : [taskInterface]){
    const completedTasks = userTasks.filter((ut)=>ut.isCompleted == true)
    return completedTasks;
}

export function findPendingTasks(userTasks : [taskInterface]){
    const completedTasks = userTasks.filter((ut)=>ut.isCompleted == false)
    return completedTasks;
}

export function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours}:${minutes}:${seconds}`;   
}


export function formatDate(date:Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();   


  return `${day}-${month}-${year}`;
}

export function formatInputDate(date:Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();   


  return `${year}-${month}-${day}`;
}
