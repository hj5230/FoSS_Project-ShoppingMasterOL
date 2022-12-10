#include <iostream>

int main() {
    system("start http://127.0.0.1:8000/");
    system("python ./manage.py runserver 8000");
    system("pause");
    return 0;
}