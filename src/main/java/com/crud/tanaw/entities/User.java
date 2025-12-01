package com.crud.tanaw.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        })
public class User {

    public User(){

    }

    public User(Integer user_id, String f_name,String m_name, String l_name, String street, String city, String region, String country, int zip_code, String email, String password, String role, String phone_number, Date birth_date, String account_status, Date date_created){
        this.user_id = user_id;
        this.f_name = f_name;
        this.m_name = m_name;
        this.l_name = l_name;
        this.street = street;
        this.city = city;
        this.region = region;
        this.country = country;
        this.zip_code = zip_code;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phone_number = phone_number;
        this.birth_date = birth_date;
        this.account_status = account_status;
        this.date_created = date_created;
    }

    @Id
    private Integer user_id;

    private String f_name;
    private String m_name;
    private String l_name;

    private String street;
    private String city;
    private String region;
    private String country;
    private int zip_code;
    @Column (unique = true)
    private String email;

    private String password;
    private String role;
    private String phone_number;
    private Date birth_date;
    private String account_status;
    private Date date_created;

    @OneToMany(mappedBy = "uploader")
    private List<Document> documents = new ArrayList<>();

    @OneToMany(mappedBy = "uploader")
    private List<Budget> budgets = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Reply> replies = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "project_head")
    private List<Activity> activities = new ArrayList<>();



    public String getfName() {
        return f_name;
    }

    public void setfName(String f_name) {
        this.f_name = f_name;
    }

    public String getmName() {
        return m_name;
    }

    public void setmName(String m_name) {
        this.m_name = m_name;
    }

    public String getlName() {
        return l_name;
    }

    public void setlName(String l_name) {
        this.l_name = l_name;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phone_number;
    }

    public void setPhoneNumber(String phone_number) {
        this.phone_number = phone_number;
    }

    public Date getBirthDate() {
        return birth_date;
    }

    public void setBirthDate(Date birth_date) {
        this.birth_date = birth_date;
    }

    public String getAccountStatus() {
        return account_status;
    }

    public void setAccountStatus(String account_status) {
        this.account_status = account_status;
    }

    public Date getDateCreated() {
        return date_created;
    }

    public void setDateCreated(Date date_created) {
        this.date_created = date_created;
    }

    public int getZipCode() {
        return zip_code;
    }

    public void setZipCode(int zip_code) {
        this.zip_code = zip_code;
    }

    public Integer getUserId() {
        return user_id;
    }

    public void setUserId(Integer user_id) {
        this.user_id = user_id;
    }

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    public List<Budget> getBudgets() {
        return budgets;
    }

    public void setBudgets(List<Budget> budgets) {
        this.budgets = budgets;
    }

    public List<Reply> getReplies() {
        return replies;
    }

    public void setReplies(List<Reply> replies) {
        this.replies = replies;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }
}
