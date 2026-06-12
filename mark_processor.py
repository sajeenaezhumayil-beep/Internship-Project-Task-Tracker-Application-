students = int(input("Enter number of students: "))

for i in range(students):


    name = input("Enter student name: ")

    mark1 = float(input("Enter mark of Sub 1: "))
    mark2 = float(input("Enter mark of Sub 2: "))
    mark3 = float(input("Enter mark of Sub 3: "))

    total = mark1 + mark2 + mark3
    avg = total / 3

    print("\n--- Result ---")
    print("Student Name:", name)
    print("Total Marks:", total)
    print("Avg Marks:", avg)

    if avg >= 90:
        print("Grade: A+")

    elif avg >= 75:
        print("Grade: A")

    elif avg >= 60:
        print("Grade: B")

    elif avg >= 50:
        print("Grade: C")

    else:
        print("Grade: Fail")

    if avg >= 50:
        print("Status: Pass")

    else:
        print("Status: Fail")
