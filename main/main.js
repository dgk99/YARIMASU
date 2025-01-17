// 관리자 계정 설정
const adminCredentials = {
    id: "admin",
    password: "admin123"
};

// 로컬 스토리지에서 회원 데이터 불러오기
let members = JSON.parse(localStorage.getItem("members")) || [];

// 회원가입 처리
function registerUser() {
    const newUserId = document.getElementById("newUserId").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const userName = document.getElementById("userName").value.trim();
    const userGender = document.getElementById("userGender").value;
    const userAge = document.getElementById("userAge").value.trim();
    const userHeight = document.getElementById("userHeight").value.trim();
    const userWeight = document.getElementById("userWeight").value.trim();
    const message = document.getElementById("signupMessage");

    if (!newUserId || !newPassword || !userName || !userGender || !userAge || !userHeight || !userWeight) {
        message.textContent = "모든 필드를 입력해 주세요!";
        message.style.color = "red";
        return;
    }

    const userExists = members.some(member => member.id === newUserId);
    if (userExists) {
        message.textContent = "이미 존재하는 아이디입니다!";
        message.style.color = "red";
        return;
    }

    const newUser = {
        id: newUserId,
        password: newPassword,
        name: userName,
        gender: userGender,
        age: parseInt(userAge, 10),
        height: parseFloat(userHeight),
        weight: parseFloat(userWeight),
        signupDate: new Date().toISOString().split("T")[0] // 현재 날짜 저장 (YYYY-MM-DD 형식)
    };

    members.push(newUser);
    localStorage.setItem("members", JSON.stringify(members));

    alert("회원가입 성공!");
    window.location.href = "main_page.html";
}

let editUserId = null; // 수정 중인 사용자 아이디 저장

// 관리자 페이지: 회원 데이터 표시
function loadMembers() {
    const membersTable = document.getElementById("membersTable").querySelector("tbody");
    membersTable.innerHTML = ""; // 기존 데이터 초기화

    if (members.length === 0) {
        const row = membersTable.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 10; // 수정 및 삭제 포함 10개 열
        cell.textContent = "등록된 회원이 없습니다.";
        cell.style.textAlign = "center";
        return;
    }

    members.forEach(member => {
        const row = membersTable.insertRow();
        row.insertCell().textContent = member.id;        // 아이디
        row.insertCell().textContent = member.password;  // 비밀번호
        row.insertCell().textContent = member.name;      // 이름
        row.insertCell().textContent = member.gender;    // 성별
        row.insertCell().textContent = member.age;       // 나이
        row.insertCell().textContent = member.height;    // 키
        row.insertCell().textContent = member.weight;    // 몸무게
        row.insertCell().textContent = member.signupDate; // 가입 날짜

        // 수정 버튼 추가
        const editButton = document.createElement("button");
        editButton.textContent = "수정";
        editButton.className = "btn edit";
        editButton.onclick = () => editMember(member.id);
        row.insertCell().appendChild(editButton);

        // 삭제 버튼 추가
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";
        deleteButton.className = "btn delete";
        deleteButton.onclick = () => deleteMember(member.id);
        row.insertCell().appendChild(deleteButton);
    });
}

// 회원 삭제
function deleteMember(userId) {
    const confirmDelete = confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    // 회원 삭제
    members = members.filter(member => member.id !== userId);

    // 데이터 저장
    localStorage.setItem("members", JSON.stringify(members));

    // 테이블 갱신
    loadMembers();
    alert("회원이 삭제되었습니다.");
}

// 회원 수정 버튼 클릭 시
function editMember(userId) {
    editUserId = userId;
    const member = members.find(member => member.id === userId);

    if (!member) return;

    // 폼에 기존 데이터 채우기
    document.getElementById("editPassword").value = member.password;
    document.getElementById("editName").value = member.name;
    document.getElementById("editGender").value = member.gender;
    document.getElementById("editAge").value = member.age;
    document.getElementById("editHeight").value = member.height;
    document.getElementById("editWeight").value = member.weight;

    // 수정 폼 표시
    document.getElementById("editForm").style.display = "block";
}

// 수정 저장
function saveEdit(event) {
    event.preventDefault();

    const memberIndex = members.findIndex(member => member.id === editUserId);
    if (memberIndex === -1) return;

    // 수정된 값 가져오기
    members[memberIndex].password = document.getElementById("editPassword").value;
    members[memberIndex].name = document.getElementById("editName").value;
    members[memberIndex].gender = document.getElementById("editGender").value;
    members[memberIndex].age = parseInt(document.getElementById("editAge").value, 10);
    members[memberIndex].height = parseFloat(document.getElementById("editHeight").value);
    members[memberIndex].weight = parseFloat(document.getElementById("editWeight").value);

    // 데이터 저장
    localStorage.setItem("members", JSON.stringify(members));

    // 폼 숨기기 및 테이블 갱신
    document.getElementById("editForm").style.display = "none";
    loadMembers();
    alert("회원 정보가 수정되었습니다.");
}

// 수정 취소
function cancelEdit() {
    document.getElementById("editForm").style.display = "none";
}

// 로그인 처리
function handleLogin() {
    const userId = document.getElementById("userId").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (!userId || !password) {
        message.textContent = "아이디와 비밀번호를 입력해 주세요!";
        message.style.color = "red";
        return;
    }

    // 관리자 로그인 확인
    if (userId === adminCredentials.id && password === adminCredentials.password) {
        alert("관리자 로그인 성공!");
        window.location.href = "admin_page.html";
        return;
    }

    // 일반 사용자 로그인 확인
    const user = members.find(member => member.id === userId && member.password === password);

    if (user) {
        // 로그인한 회원 정보를 세션 스토리지에 저장
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        alert(`로그인 성공! 환영합니다, ${user.name}!`);
        window.location.href = "user_page.html"; // 개인 정보 확인 페이지로 이동
    } else {
        message.textContent = "아이디 또는 비밀번호가 잘못되었습니다.";
        message.style.color = "red";
    }
}

// 비밀번호 표시/숨기기
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.querySelector(".toggle-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.textContent = "🙈"; // 눈 감는 아이콘
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "👁️"; // 눈 뜨는 아이콘
    }
}

// 회원 정보 로드
function loadUserInfo() {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("로그인 정보가 없습니다. 메인 페이지로 이동합니다.");
        window.location.href = "main_page.html";
        return;
    }

    const userInfoTable = document.getElementById("userInfoTable");
    const userInfo = [
        { key: "아이디", value: loggedInUser.id },
        { key: "이름", value: loggedInUser.name },
        { key: "성별", value: loggedInUser.gender },
        { key: "나이", value: loggedInUser.age },
        { key: "키", value: loggedInUser.height + " cm" },
        { key: "몸무게", value: loggedInUser.weight + " kg" }
    ];

    userInfo.forEach(info => {
        const row = userInfoTable.insertRow();
        const cellKey = row.insertCell(0);
        const cellValue = row.insertCell(1);
        cellKey.textContent = info.key;
        cellValue.textContent = info.value;
    });
}

// 아이디 찾기
function findId() {
    const nameInput = document.getElementById("findName").value.trim();
    const resultMessage = document.getElementById("resultMessage");
    const idList = document.getElementById("idList");

    // 입력값 유효성 검사
    if (!nameInput) {
        resultMessage.textContent = "이름을 입력해 주세요!";
        resultMessage.style.color = "red";
        idList.innerHTML = ""; // 기존 결과 초기화
        return;
    }

    // 로컬 스토리지에서 데이터 가져오기
    const members = JSON.parse(localStorage.getItem("members")) || []; // 저장된 데이터 가져오기

    // 이름에 매칭되는 아이디 검색
    const matchingIds = members
        .filter(member => member.name === nameInput)
        .map(member => member.id);

    // 결과 출력
    if (matchingIds.length > 0) {
        resultMessage.textContent = `${nameInput}님과 관련된 아이디:`;
        resultMessage.style.color = "green";
        idList.innerHTML = matchingIds.map(id => `<li>${id}</li>`).join(""); // 아이디 리스트 출력
    } else {
        resultMessage.textContent = "해당 이름으로 등록된 아이디가 없습니다.";
        resultMessage.style.color = "red";
        idList.innerHTML = ""; // 기존 결과 초기화
    }
}

// 비밀번호 찾기
function findPassword() {
    const nameInput = document.getElementById("findName").value.trim();
    const idInput = document.getElementById("findId").value.trim();
    const resultMessage = document.getElementById("resultMessage");

    // 입력값 유효성 검사
    if (!nameInput || !idInput) {
        resultMessage.textContent = "이름과 아이디를 모두 입력해 주세요!";
        resultMessage.style.color = "red";
        return;
    }

    // 로컬 스토리지에서 데이터 가져오기
    const members = JSON.parse(localStorage.getItem("members")) || [];

    // 이름과 아이디에 매칭되는 비밀번호 검색
    const matchingUser = members.find(member => member.name === nameInput && member.id === idInput);

    // 결과 출력
    if (matchingUser) {
        resultMessage.textContent = `${nameInput}님 (${idInput})의 비밀번호는 "${matchingUser.password}"입니다.`;
        resultMessage.style.color = "green";
    } else {
        resultMessage.textContent = "해당 이름과 아이디로 등록된 사용자를 찾을 수 없습니다.";
        resultMessage.style.color = "red";
    }
}

// 취소 버튼 동작
function goBack() {
    alert("취소 버튼을 눌렀습니다. 메인 페이지로 돌아갑니다.");
}

// 로그아웃 처리
function logout() {
    sessionStorage.removeItem("loggedInUser");
    alert("로그아웃되었습니다.");
    window.location.href = "main_page.html";
}

// 메인 페이지로 돌아가기 (로그아웃)
function goBack() {
    window.location.href = "main_page.html";
}

// 회원가입 페이지로 이동
function goToSignup() {
    window.location.href = "signup.html";
}
