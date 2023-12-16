export async function getWork() {
    const data = await fetch('http://localhost:5678/api/works').then(response => response.json());
    console.log(data);
}