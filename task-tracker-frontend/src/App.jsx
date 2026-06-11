import { useState, useEffect } from "react";

import {
  getTasks,
  createTask,
  deleteTaskAPI,
  updateTaskAPI,
  suggestPriority
} from "./api/taskApi";

function App() {

const [tasks,setTasks]=useState([]);
const [newTask,setNewTask]=useState("");
const [editingId,setEditingId]=useState(null);
const [editText,setEditText]=useState("");
const [search,setSearch]=useState("");
const [statusFilter,setStatusFilter]=useState("all");
const [priority,setPriority]=useState("low");
const [dueDate,setDueDate]=useState("");
const [taskStatus,setTaskStatus]=useState("todo");

const [aiMessage,setAiMessage]=useState("");
const [notification,setNotification]=useState("");
const [darkMode, setDarkMode] = useState(true);
const [aiReason,setAiReason]=useState("");   // ✅ ADDED
const hour = new Date().toLocaleString("en-US", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  hour12: false
});

const currentHour = Number(hour);
const greeting =
currentHour < 12
? "☀️ Good Morning"
: currentHour < 18
? "🌤 Good Afternoon"
: "🌙 Good Evening";
useEffect(()=>{

loadTasks();

},[]);

async function loadTasks(){

try{
const response=await getTasks();
setTasks(response.data);
}catch(error){
console.log(error);
}

}

// ---------------- ADD TASK ----------------
const addTask = async () => {

  if (newTask.trim() === "") return;

 await createTask({

title: newTask,

status: taskStatus,

priority: priority,

description: "",

due_date: dueDate

});

  setNewTask("");

setNotification(
"✅ Task Added Successfully"
);
setTimeout(() => {
  setNotification("");
}, 2000);

loadTasks();
};

// ---------------- AI SUGGEST ----------------
const getAISuggestion = async () => {

  if (newTask.trim() === "") return;

  try {

    const response = await suggestPriority(newTask);

    setPriority(response.data.priority);

    setAiMessage(
      `✨ AI Suggested: ${response.data.priority.toUpperCase()}`
    );

    setNotification(
"🤖 AI Suggestion Generated"
);

setTimeout(() => {
  setNotification("");
}, 2000);

    setAiReason(response.data.reason); // ✅ IMPORTANT

  } catch (error) {
    console.log(error);
  }
};

// ---------------- DELETE ----------------
const deleteTask = async (id) => {

 await deleteTaskAPI(id);

setNotification(
"🗑️ Task Deleted"
);

setTimeout(() => {
  setNotification("");
}, 2000);

loadTasks();

};

// ---------------- EDIT ----------------
const startEdit=(task)=>{

setEditingId(task.id);
setEditText(task.title);

};

const updateTask=async(id)=>{

const task=tasks.find(t=>t.id===id);

await updateTaskAPI(
  id,
  {
    title:editText,
    status:task.status,
    priority:task.priority,
    description:task.description || ""
  }
);

setEditingId(null);

setEditText("");

setNotification(
"✏️ Task Updated"
);

setTimeout(() => {
  setNotification("");
}, 2000);
loadTasks();

};

// ---------------- FILTER ----------------
const filteredTasks=
tasks
.filter(task=>{

const matchesSearch=
task.title.toLowerCase().includes(search.toLowerCase());

const matchesStatus=
statusFilter==="all" || task.status===statusFilter;

return matchesSearch && matchesStatus;

})
.sort((a,b)=>{

const order={
high:3,
medium:2,
low:1
};

return order[b.priority]-order[a.priority];

});

const completed =
tasks.filter(
t => t.status === "completed"
).length;

const highPriority =
tasks.filter(
t => t.priority === "high"
).length;
// ---------------- UI ----------------
return(

<div style={{
minHeight:"100vh",
padding:"40px",
background: darkMode
? "linear-gradient(135deg,#0f172a,#172554)"
: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
fontFamily:"Segoe UI"
}}>
<p style={{
textAlign:"center",
color:"#38bdf8",
fontWeight:"600",
marginBottom:"10px"
}}>
{greeting}
</p>
<h1 style={{
textAlign:"center",
fontSize:"30px",
fontWeight:"700",
letterSpacing:"0.5px",
color: darkMode ? "white" : "#0f172a",
marginBottom:"20px"
}}>
🚀 AI Task Manager
</h1>
<p
style={{
textAlign:"center",
color: darkMode ? "#cbd5e1" : "#475569",
marginTop:"-10px",
marginBottom:"30px"
}}
>
Smart task planning powered by AI
</p>
<div style={{
display:"flex",
justifyContent:"center",
marginBottom:"20px"
}}>

<button
onClick={()=>setDarkMode(!darkMode)}
style={{
padding:"12px 24px",
border:"none",
borderRadius:"30px",
cursor:"pointer",
fontSize:"16px",
fontWeight:"600",
background:"rgba(255,255,255,0.15)",
backdropFilter:"blur(10px)",
color: darkMode ? "white" : "#0f172a",
boxShadow:"0 4px 15px rgba(0,0,0,0.3)"
}}
>
{darkMode ? "☀️" : "🌙"}
</button>

</div>
{/* STATS */}
<div style={{
display:"flex",
justifyContent:"center",
gap:"20px",
marginBottom:"35px",
flexWrap:"wrap"
}}>
<StatCard title="Total Tasks" value={tasks.length}/>
<StatCard title="Completed" value={completed}/>
<StatCard title="Todo" value={tasks.length-completed}/>
<StatCard title="High Priority" value={highPriority}/>
</div>

  <p style={{
textAlign:"center",
fontSize:"20px",
fontWeight:"bold",
color:"#facc15",
marginBottom:"20px"
}}>
📊 {tasks.length ? Math.round((completed/tasks.length)*100) : 0}% Completed
</p>
{/* SEARCH */}
<div style={{
display:"flex",
justifyContent:"center",
gap:"15px",
flexWrap:"wrap",
marginBottom:"20px"
}}>
<input
placeholder="🔍 Search"
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={inputStyle}
/>

<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
style={inputStyle}
>
<option value="all">All Tasks</option>
<option value="todo">Todo</option>
<option value="completed">Completed</option>
</select>
</div>

{/* INPUT AREA */}
<div style={{
display:"flex",
justifyContent:"center",
gap:"15px",
flexWrap:"wrap",
marginBottom:"40px"
}}>

<input
placeholder="Enter Task"
value={newTask}
onChange={(e)=>setNewTask(e.target.value)}
style={inputStyle}
/>
<input
type="date"
value={dueDate}
onChange={(e)=>setDueDate(e.target.value)}
style={inputStyle}
/>
<select
value={priority}
onChange={(e)=>setPriority(e.target.value)}
style={inputStyle}
>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>

<select
value={taskStatus}
onChange={(e)=>setTaskStatus(e.target.value)}
style={inputStyle}
>
<option value="todo">Todo</option>
<option value="completed">Completed</option>
</select>

<button
onClick={getAISuggestion}
style={{
padding:"15px 25px",
background:
"linear-gradient(135deg,#0f172a,#1e3a8a)",
border:"none",
borderRadius:"14px",
color: darkMode ? "#cbd5e1" : "#475569",
fontWeight:"600",
cursor:"pointer",
boxShadow:"0 4px 15px rgba(124,58,237,0.4)"
}}
>
✨ AI Suggest
</button>

<button
onClick={addTask}
style={{
padding:"15px 25px",
background:"linear-gradient(45deg,#06b6d4,#10b981)",
border:"none",
borderRadius:"12px",
color: darkMode ? "#cbd5e1" : "#475569",
fontWeight:"bold",
cursor:"pointer"
}}
>
+ Add Task
</button>

</div>
{notification && (

<div
style={{
background:"#10b981",
color:"#cbd5e1",
padding:"12px",color: darkMode ? "#cbd5e1" : "#475569",
borderRadius:"12px",
textAlign:"center",
marginBottom:"20px",
fontWeight:"bold",
width:"fit-content",
margin:"0 auto 20px auto"
}}
>

{notification}

</div>

)}
{/* AI MESSAGE */}
{aiMessage && (
  <p style={{
    color:"#f8fafc",
    textAlign:"center",
    marginBottom:"10px",
    fontSize:"18px",
    fontWeight:"bold",
    background:"rgba(255,255,255,0.12)",
    padding:"12px",
    borderRadius:"12px",
    width:"fit-content",
    margin:"0 auto 10px auto"
  }}>
    {aiMessage}
  </p>
)}

{/* AI REASON */}
{aiReason && (
  <p style={{
    color:"#cbd5e1",
    textAlign:"center",
    marginBottom:"20px",
    fontSize:"14px",
    opacity:"0.85"
  }}>
    🤖 Reason: {aiReason}
  </p>
)}

{/* TASK LIST */}
<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:"25px"
}}>

{filteredTasks.length === 0 && (
<p style={{
textAlign:"center",
fontSize:"12px",
color: darkMode ? "#cbd5e1" : "#475569"
}}>
📭 No tasks found
</p>
)}
{filteredTasks.map(task => {

const overdue =
task.due_date &&
new Date(task.due_date) < new Date() &&
task.status !== "completed";

const borderColor =
task.priority === "high"
? "#ef4444"
: task.priority === "medium"
? "#3b82f6"
: "#22c55e";

return (

<div
key={task.id}

onMouseEnter={(e)=>{
e.currentTarget.style.transform="translateY(-5px)";
}}

onMouseLeave={(e)=>{
e.currentTarget.style.transform="translateY(0px)";
}}


style={{
background:"rgba(255,255,255,0.08)",
backdropFilter:"blur(20px)",
padding:"18px",
borderRadius:"18px",
color: darkMode ? "#cbd5e1" : "#475569",
textAlign:"center",
boxShadow:"0 8px 30px rgba(0,0,0,.35)",
border:"1px solid rgba(255,255,255,.1)",
transition:"0.3s",
cursor:"pointer",
transform:"translateY(0px)",
}}
>

{editingId===task.id ? (

<>
<input
value={editText}
onChange={(e)=>setEditText(e.target.value)}
style={inputStyle}
/>

<button
onClick={()=>updateTask(task.id)}
style={{
padding:"10px 20px",
border:"none",
borderRadius:"10px",
background:"#10b981",
color: darkMode ? "#cbd5e1" : "#475569",
cursor:"pointer",
marginTop:"10px"
}}
>
Save
</button>
</>

) : (

<>

<h2
style={{
fontSize:"24px",
fontWeight:"700",
color: darkMode ? "#ffffff" : "#0f172a",
marginBottom:"25px",
textAlign:"center",
letterSpacing:"0.5px"
}}
>
{task.title}
</h2>
<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"12px"
}}
>
<span> Status</span>
<Badge value={task.status}/>
</div>

<div
style={{
display:"flex",
alignItems:"center",
gap:"10px",
marginBottom:"12px"
}}
>
<span>Priority</span>
<Badge value={task.priority}/>
</div>

{task.due_date && (
<p
style={{
marginBottom:"10px",
fontWeight:"bold"
}}
>
<span
style={{
background:"rgba(59,130,246,.15)",
padding:"4px 12px",
fontSize:"14px",
fontWeight:"600",
borderRadius:"20px",
border:"1px solid rgba(59,130,246,.3)"
}}
>
📅 {task.due_date}
</span>
</p>
)}

{overdue && (
<p
style={{
color:"#f87171",
fontWeight:"bold",
marginBottom:"10px"
}}
>
⚠️ Overdue Task
</p>
)}

<p
style={{
color: darkMode ? "#e2e8f0" : "#475569",
fontStyle:"italic",
marginBottom:"15px",
textAlign:"left"
}}
>
{task.description || "No Description"}
</p>
<div style={{
display:"flex",
justifyContent:"center",
gap:"12px",
marginTop:"20px"
}}>

<button
onClick={()=>startEdit(task)}
style={{
padding:"8px 18px",
border:"none",
borderRadius:"8px",
fontWeight:"600",
background:"linear-gradient(45deg,#2563eb,#60a5fa)",
color: darkMode ? "#cbd5e1" : "#475569",
cursor:"pointer"
}}
>
 Edit
</button>

<button
onClick={()=>deleteTask(task.id)}
style={{
padding:"10px 22px",
fontSize:"15px",
border:"none",
borderRadius:"8px",
fontWeight:"600",
background:"linear-gradient(45deg,#dc2626,#f87171)",
color: darkMode ? "#cbd5e1" : "#475569",
cursor:"pointer"
}}
>
 Delete
</button>

</div>

</>

)}

</div>

);

})}

</div>

</div>

);

}

// ---------------- BADGE ----------------
function Badge({value}){

const colors={
completed:"#10b981",
todo:"#f59e0b",
high:"#ef4444",
medium:"#3b82f6",
low:"#22c55e"
};

return(
<span style={{
background:colors[value],
padding:"6px 14px",
borderRadius:"20px",
marginLeft:"10px"
}}>
{value}
</span>
);

}

// ---------------- STATS ----------------
function StatCard({title,value}){

return(

<div
style={{
background:"rgba(255,255,255,.08)",
backdropFilter:"blur(10px)",
padding:"20px",
borderRadius:"18px",
width:"140px",
textAlign:"center",
border:"1px solid rgba(255,255,255,.1)"
}}
>

<h2
style={{
fontSize:"22px",
marginBottom:"20px",
color:"#cbd5e1",
fontWeight:"600",
textAlign:"center"
}}
>
{value}
</h2>

<p
style={{
marginTop:"10px",
color:"rgba(255,255,255,.85)"
}}
>
{title}
</p>

</div>

);

}

// ---------------- STYLE ----------------
const inputStyle={
padding:"14px",
borderRadius:"12px",
border:"none",
minWidth:"220px",
fontSize:"16px"
};

export default App;