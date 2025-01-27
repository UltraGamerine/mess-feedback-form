import "./forms.css"

export default async function Form({params}){
    const { id } = await params;
    const currDate = new Date().toLocaleDateString();
    const currTime = new Date().toLocaleTimeString();
    const greet=()=>{
        const now = new Date();
        const currTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes since midnight
    
        // Define intervals in minutes
        const morningStart = 7 * 60 + 45; // 7:45 AM
        const morningEnd = 10 * 60 + 30; // 10:30 AM
    
        const afternoonStart = 12 * 60 + 45; // 12:45 PM
        const afternoonEnd = 15 * 60; // 3:00 PM
    
        const eveningStart = 19 * 60 + 45; // 7:45 PM
        const eveningEnd = 22 * 60 + 30; // 10:30 PM
    
        // Determine the appropriate greeting
        if (currTime >= morningStart && currTime <= morningEnd) {
            return "Good Morning!";
        } else if (currTime >= afternoonStart && currTime <= afternoonEnd) {
            return "Good Afternoon!";
        } else if (currTime >= eveningStart && currTime <= eveningEnd) {
            return "Good Evening!";
        } else {
            return "Hello, Form will the Available Soon..."; // Default greeting outside the specified intervals
        }
    }
    return (
        <div className= "flex flex-col h-[80vh] items-center pt-10 gap-4 bg-gray-200">
            <h1 className="text-black-600 text-xl">{currDate} {currTime}</h1>
            <h1 className="text-3xl text-violet-400">{greet()}</h1>
            <h1 className="text-3xl font-bold">
            Form: {id}
            </h1>
        </div>
    )
}