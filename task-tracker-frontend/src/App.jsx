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
tasks.filter(task=>{

const matchesSearch=
task.title.toLowerCase().includes(search.toLowerCase());

const matchesStatus=
statusFilter==="all" || task.status===statusFilter;

return matchesSearch && matchesStatus;

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
? "linear-gradient(135deg,#0f172a,#1e3a8a)"
: "linear-gradient(135deg,#f8fafc,#cbd5e1)",
fontFamily:"Segoe UI"
}}>

<h1 style={{
textAlign:"center",
fontSize:"38px",
fontWeight:"700",
letterSpacing:"0.5px",
color:"white",
marginBottom:"25px"
}}>
🚀 AI Task Management Dashboard
</h1>

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
color:"white",
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

{/* SEARCH */}
<div style={{
display:"flex",
justifyContent:"center",
gap:"10px",
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
gap:"10px",
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
color:"white",
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
color:"white",
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
color:"white",
padding:"12px",
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
    fontSize:"20px",
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
style={{
background:"rgba(255,255,255,.12)",
backdropFilter:"blur(20px)",
padding:"30px",
borderRadius:"25px",
color:"white",
boxShadow:"0 8px 30px rgba(0,0,0,.35)",
border:`3px solid ${borderColor}`,
transition:"0.3s"
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
color:"white",
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
fontSize:"28px",
marginBottom:"15px"
}}
>
{task.title}
</h2>

<p style={{marginBottom:"10px"}}>
📌 Status:
<Badge value={task.status}/>
</p>

<p style={{marginBottom:"10px"}}>
🔥 Priority:
<Badge value={task.priority}/>
</p>

{task.due_date && (
<p
style={{
marginBottom:"10px",
fontWeight:"bold"
}}
>
📅 Due:
{task.due_date}
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
opacity:"0.9",
fontStyle:"italic",
marginBottom:"15px"
}}
>
📝 {task.description || "No Description"}
</p>

<div style={{
display:"flex",
gap:"10px"
}}>

<button
onClick={()=>startEdit(task)}
style={{
padding:"10px 15px",
border:"none",
borderRadius:"10px",
background:"#3b82f6",
color:"white",
cursor:"pointer"
}}
>
✏️ Edit
</button>

<button
onClick={()=>deleteTask(task.id)}
style={{
padding:"10px 15px",
border:"none",
borderRadius:"10px",
background:"#ef4444",
color:"white",
cursor:"pointer"
}}
>
🗑 Delete
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
<div style={{
background:"rgba(255,255,255,.15)",
backdropFilter:"blur(15px)",
padding:"25px",
borderRadius:"20px",
width:"180px",
minHeight:"120px",
display:"flex",
flexDirection:"column",
justifyContent:"center",
textAlign:"center",
color:"white",
boxShadow:"0 6px 20px rgba(0,0,0,.25)"
}}>
<h3 style={{
fontSize:"36px",
margin:"0"
}}>
{value}
</h3>
<p style={{
opacity:"0.85",
marginTop:"10px"
}}>
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