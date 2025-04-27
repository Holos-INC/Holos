# HOLOS

MIT License

Copyright (c) 2025 HolosINC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Introduction

Welcome to Holos, the application where clients and artists connect with no need of numerous
apps or with being scared of scams

## Requirements to operate over software

To launch this repository you will first need this software:

- Java 17
- MariaDB 11.4 / MySQL 8.0 (recommended)

Firstly, you have to clone the repo, supposing you previously have already manage all git 
credentials

sh
```
git clone https://github.com/tu-usuario/holos.git
```

Secondly you will need to configure your database following the next commands opening mysql command line (or mariaDB):

```sh
mysql -u root -p
mariadb -u root -p
```
At this point a "Enter your password:" will appear on the CLI so you can introduce your root password.
You will follow by creating the database with the commands especified below:

```SQL
CREATE DATABASE holos_db;
CREATE USER 'H0l0s_DB'@'localhost' IDENTIFIED BY 'H0l0s1$PP';
GRANT ALL PRIVILEGES ON holos_db.* TO 'H0l0s_DB'@'localhost';
FLUSH PRIVILEGES;
```

Finally, to run the application is recommended to install the java extension package for VS Code, it will make everything easier
Go to the HolosApplication.java and press run on the upper right section

## Posible solutions to any error

If some errors occurs during this proccess you can use any of this resources to solve it:

1. Check if MariaDB or MySQL is in the PATH: C:\Program Files\MariaDB 11.4\bin
2. Check you have the correct Java version, you can know this by tipping on the command line: java --version, if something strange happens check on the path for: C:\Program Files\Java\jdk-17\bin
3. If u occurr onto an error related with mvn not found as a command check taht you have maven installed on your computer (installation page)[https://maven.apache.org/download.cgi], if so, check on the path for: C:\Program Files\apache-maven-3.9.9\bin
