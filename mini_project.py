

tasks = []

number = int(input("Enter number of tasks: "))


for i in range(number):

    name = input("\nEnter task name: ")
    status = input("Enter status (completed/pending/todo): ")

    task = {
        "name": name,
        "status": status.lower()
    }

    tasks.append(task)


print("\n--- COMPLETED TASKS ---")

for task in tasks:

    if task["status"] == "completed":
        print(task["name"])

print("\n--- PENDING TASKS ---")

for task in tasks:

    if task["status"] == "pending":
        print(task["name"])

print("\n--- TODO TASKS ---")

for task in tasks:

    if task["status"] == "todo":
        print(task["name"])
