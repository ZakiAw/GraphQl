document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nickname = document.getElementById("nname").value;
    const password = document.getElementById("password").value;

    try {
        const credential = btoa(`${nickname}:${password}`);
    
        const response = await fetch("https://adam-jerusalem.nd.edu/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credential}`
            }
        });
        if (!response.ok) {
        const errorMessageDiv = document.getElementById('error-message');
        errorMessageDiv.textContent = 'Invalid credentials';
        errorMessageDiv.style.display = 'block';
        throw error
        }
        const data = await response.json();
        localStorage.setItem("Token", data)
        window.location.href = "home.html"
        console.log(data);

    } catch (error) {
        console.error("fail", error);
    }
})
