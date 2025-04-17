const quizData = [
    {
      id: 3,
      title: "Kiến thức React cơ bản",
      description: "Quiz này giúp bạn ôn lại kiến thức cơ bản về React.",
      questions: [
        {
          question: "React là gì?",
          options: [
            "Một thư viện JavaScript để xây dựng giao diện người dùng",
            "Một framework CSS",
            "Một phần mềm chỉnh sửa video",
            "Một cơ sở dữ liệu NoSQL",
          ],
          correctAnswer: "Một thư viện JavaScript để xây dựng giao diện người dùng",
        },
        {
          question: "Hook nào dùng để quản lý state trong React?",
          options: ["useRef", "useEffect", "useState", "useContext"],
          correctAnswer: "useState",
        },
        {
          question: "JSX là gì?",
          options: [
            "Một kiểu dữ liệu trong JavaScript",
            "Một ngôn ngữ lập trình mới",
            "Cú pháp mở rộng cho JavaScript kết hợp HTML",
            "Thư viện của React",
          ],
          correctAnswer: "Cú pháp mở rộng cho JavaScript kết hợp HTML",
        },
        {
          question: "Thành phần nào là component trong React?",
          options: ["<div>", "function Hello() {}", "<script>", "HTML tag"],
          correctAnswer: "function Hello() {}",
        },
        {
          question: "useEffect dùng để làm gì?",
          options: [
            "Thêm hiệu ứng CSS",
            "Quản lý side effects như gọi API",
            "Tạo style động",
            "Tăng hiệu suất React",
          ],
          correctAnswer: "Quản lý side effects như gọi API",
        },
      ],
    },
    {
      id: 1,
      title: "Lịch sử Việt Nam",
      description: "Quiz này giúp bạn kiểm tra kiến thức lịch sử Việt Nam.",
      questions: [
        {
          question: "Ai là người sáng lập Đảng Cộng sản Việt Nam?",
          options: ["Hồ Chí Minh", "Phan Bội Châu", "Nguyễn Ái Quốc", "Trường Chinh"],
          correctAnswer: "Hồ Chí Minh",
        },
        {
          question: "Năm nào Việt Nam tuyên bố độc lập?",
          options: ["1945", "1949", "1954", "1960"],
          correctAnswer: "1945",
        },
        {
          question: "Chiến thắng nào là bước ngoặt quan trọng trong kháng chiến chống Mỹ?",
          options: ["Điện Biên Phủ", "Tết Mậu Thân", "Mỹ Lai", "Hà Nội - Điện Biên Phủ trên không"],
          correctAnswer: "Tết Mậu Thân",
        },
        {
          question: "Thành lập nước Việt Nam Dân chủ Cộng hòa vào năm nào?",
          options: ["1945", "1940", "1954", "1965"],
          correctAnswer: "1945",
        },
        {
          question: "Ai là người lãnh đạo cuộc khởi nghĩa Hai Bà Trưng?",
          options: ["Trưng Trắc và Trưng Nhị", "Nguyễn Thị Minh Khai", "Lê Lợi", "Trần Hưng Đạo"],
          correctAnswer: "Trưng Trắc và Trưng Nhị",
        },
      ],
    },
    {
      id: 4,
      title: "Toán học THPT",
      description: "Quiz này giúp bạn ôn lại các kiến thức toán học phổ biến trong chương trình THPT.",
      questions: [
        {
          question: "Công thức tính diện tích tam giác là gì?",
          options: ["1/2 * a * b", "a * b", "a^2 + b^2", "1/2 * a * b * sin(C)"],
          correctAnswer: "1/2 * a * b",
        },
        {
          question: "Định lý Pythagoras nói về mối quan hệ nào?",
          options: ["Các cạnh của tam giác vuông", "Các góc của tam giác vuông", "Các đường chéo của hình vuông", "Công thức tính diện tích tam giác vuông"],
          correctAnswer: "Các cạnh của tam giác vuông",
        },
        {
          question: "Đạo hàm của x^2 là gì?",
          options: ["2x", "x", "2", "x^2"],
          correctAnswer: "2x",
        },
        {
          question: "Số pi (π) có giá trị gần đúng là bao nhiêu?",
          options: ["3.14", "2.71", "1.62", "4.56"],
          correctAnswer: "3.14",
        },
        {
          question: "Phương trình bậc hai có dạng gì?",
          options: ["ax^2 + bx + c = 0", "ax^2 + b = 0", "ax + b = 0", "ax^3 + bx^2 + c = 0"],
          correctAnswer: "ax^2 + bx + c = 0",
        },
      ],
    },
    {
      id: 5,
      title: "Kiến thức tổng quát",
      description: "Quiz này giúp bạn kiểm tra các kiến thức về thế giới xung quanh.",
      questions: [
        {
          question: "Ai là người phát minh ra điện thoại?",
          options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Albert Einstein"],
          correctAnswer: "Alexander Graham Bell",
        },
        {
          question: "Tượng Nữ thần Tự do tọa lạc ở đâu?",
          options: ["New York, USA", "Paris, Pháp", "London, Anh", "Rome, Italy"],
          correctAnswer: "New York, USA",
        },
        {
          question: "Bức tranh Mona Lisa được vẽ bởi ai?",
          options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
          correctAnswer: "Leonardo da Vinci",
        },
        {
          question: "Nước nào có diện tích lớn nhất thế giới?",
          options: ["Canada", "Nga", "Hoa Kỳ", "Trung Quốc"],
          correctAnswer: "Nga",
        },
        {
          question: "Khí oxy được phát hiện bởi ai?",
          options: ["Albert Einstein", "Isaac Newton", "Joseph Priestley", "Marie Curie"],
          correctAnswer: "Joseph Priestley",
        },
      ],
    },
    {
      id: 9,
      title: "Lập trình Python",
      description: "Quiz này giúp bạn kiểm tra kiến thức cơ bản về Python.",
      questions: [
        {
          question: "Câu lệnh nào dùng để in ra màn hình trong Python?",
          options: ["echo", "print()", "System.out.println()", "console.log()"],
          correctAnswer: "print()",
        },
        {
          question: "Trong Python, kiểu dữ liệu nào không thay đổi giá trị sau khi tạo?",
          options: ["List", "Dictionary", "Tuple", "Set"],
          correctAnswer: "Tuple",
        },
        {
          question: "Câu lệnh nào được dùng để nhập giá trị từ người dùng?",
          options: ["input()", "scan()", "read()", "get()"],
          correctAnswer: "input()",
        },
        {
          question: "Python là ngôn ngữ lập trình gì?",
          options: ["Biến dạng của C", "Dễ học, thông dịch, đa mục đích", "Máy tính lượng tử", "Hệ điều hành"],
          correctAnswer: "Dễ học, thông dịch, đa mục đích",
        },
        {
          question: "Câu lệnh nào dùng để tạo một vòng lặp trong Python?",
          options: ["for", "loop", "while", "both a and c"],
          correctAnswer: "both a and c",
        },
      ],
    },
    {
      id: 6,
      title: "Khoa học máy tính",
      description: "Kiểm tra kiến thức về các thuật toán và cấu trúc dữ liệu trong khoa học máy tính.",
      questions: [
        {
          question: "Thuật toán sắp xếp nào có độ phức tạp tốt nhất trong trường hợp trung bình?",
          options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Merge Sort"],
          correctAnswer: "Quick Sort",
        },
        {
          question: "Cấu trúc dữ liệu nào sử dụng cơ chế Last In First Out (LIFO)?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correctAnswer: "Stack",
        },
        {
          question: "Trong cơ sở dữ liệu, SQL là gì?",
          options: ["Ngôn ngữ lập trình", "Ngôn ngữ truy vấn cơ sở dữ liệu", "Một loại cơ sở dữ liệu", "Phần mềm quản lý dữ liệu"],
          correctAnswer: "Ngôn ngữ truy vấn cơ sở dữ liệu",
        },
        {
          question: "Cấu trúc dữ liệu nào sử dụng danh sách liên kết?",
          options: ["Stack", "Queue", "Linked List", "Hash Table"],
          correctAnswer: "Linked List",
        },
        {
          question: "Trong thuật toán tìm kiếm nhị phân, độ phức tạp thời gian của thuật toán là gì?",
          options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
          correctAnswer: "O(log n)",
        },
      ],
    },
    {
      id: 7,
      title: "Thể thao thế giới",
      description: "Kiểm tra kiến thức về các môn thể thao và sự kiện thể thao quốc tế.",
      questions: [
        {
          question: "Môn thể thao nào có Olympic vào mùa hè?",
          options: ["Bóng đá", "Bơi lội", "Khúc côn cầu", "Đua xe"],
          correctAnswer: "Bơi lội",
        },
        {
          question: "Ai là cầu thủ bóng đá nổi tiếng người Argentina?",
          options: ["Cristiano Ronaldo", "Lionel Messi", "Neymar", "Pele"],
          correctAnswer: "Lionel Messi",
        },
        {
          question: "Đội bóng nào đã giành chiến thắng trong World Cup 2018?",
          options: ["Pháp", "Brazil", "Argentina", "Germany"],
          correctAnswer: "Pháp",
        },
        {
          question: "Ai là người sáng lập giải đấu NBA?",
          options: ["Larry Bird", "Michael Jordan", "James Naismith", "Jerry West"],
          correctAnswer: "James Naismith",
        },
        {
          question: "Cúp vàng bóng đá World Cup được tổ chức bao lâu một lần?",
          options: ["1 năm", "4 năm", "8 năm", "10 năm"],
          correctAnswer: "4 năm",
        },
      ],
    },
  ];
  
  export default quizData;
  