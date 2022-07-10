import { App } from "./app";

const { app } = new App();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
