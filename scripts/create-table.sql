CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    role ENUM('user','admin') NOT NULL DEFAULT 'user'
);


CREATE TABLE tutors (
    tutor_id CHAR(36) PRIMARY KEY, -- UUID
    user_id CHAR(36) NOT NULL,     -- FK to users.user_id
    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    grade_levels JSON NOT NULL,        -- stores multiple selections, e.g. ["KG","1-4"]
    subjects JSON NOT NULL,            -- stores multiple subjects
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    available_days JSON NOT NULL,      -- stores array of days, e.g. ["Monday","Wednesday"]
    delivery_method ENUM('online', 'face-to-face') NOT NULL,
    cv_path VARCHAR(255) NOT NULL,     -- relative file path to uploaded PDF
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

 
CREATE TABLE tutees (
    tutee_id CHAR(36) PRIMARY KEY,          -- UUID for this tutee record
    user_id CHAR(36) NOT NULL,              -- FK to users table

    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    grade_level VARCHAR(20) NOT NULL,       -- e.g., "8" or "KG"
    
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- JSON arrays to store multiple selections
    subjects JSON NOT NULL,                 -- ["Maths", "Physics"]
    available_days JSON NOT NULL,           -- ["Monday", "Wednesday"]
	delivery_method ENUM('online', 'face-to-face') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tutees_user FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);


 
CREATE TABLE trainings (
    training_id CHAR(36) PRIMARY KEY,        -- UUID for training registration
    user_id CHAR(36) NOT NULL,              -- FK to users table

    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    training_type VARCHAR(100) NOT NULL,     -- e.g. "Coding", "UX/UI"
    delivery_method ENUM('online', 'face-to-face') NOT NULL,
    paymnet_status ENUM('paid', 'unpaid') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_trainings_user FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);



 
CREATE TABLE researches (
    research_id CHAR(36) PRIMARY KEY,              -- UUID for this research registration
    user_id CHAR(36) NOT NULL,                     -- FK to users table

    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    study_area TEXT NOT NULL,                      -- free text research area/topic
    research_level ENUM('undergraduate', 'graduate', 'phd', 'professional') NOT NULL,
    delivery_method ENUM('online', 'face-to-face') NOT NULL,
    paymnet_status ENUM('paid', 'unpaid') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_researches_user FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);



 
CREATE TABLE entrepreneurships (
    entrepreneurship_id CHAR(36) PRIMARY KEY,   -- UUID for entrepreneurship registration
    user_id CHAR(36) NOT NULL,                  -- FK to users table

    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,

    paymnet_status ENUM('paid', 'unpaid') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_entrepreneurships_user FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);
