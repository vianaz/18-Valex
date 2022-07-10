import { connection } from "../db/database";

export interface Employee {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
}

export async function findEmployeeById(id: number) {
	const result = await connection.query<Employee, [number]>(
		"SELECT * FROM employees WHERE id=$1",
		[id]
	);

	return result.rows[0];
}
