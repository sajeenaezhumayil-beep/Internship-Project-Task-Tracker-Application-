import json

name = input("Enter your name: ")
age = int(input("Enter your age: "))
course = input("Enter your course: ")

student = {
    "name": name,
    "age": age,
    "course": course
}

formatted_json = json.dumps(student, indent=4)

print("\n--- Formatted JSON Data ---")
print(formatted_json)

