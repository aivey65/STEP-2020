// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import java.lang.StringBuffer;
import java.io.IOException;
import java.time.format.DateTimeFormatter;  
import java.time.LocalDateTime;   
import java.util.Arrays;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
    private ArrayList<Comment> allComments = new ArrayList<Comment>();

    /**
    * Class to organize comments for more detailed displays. 
    */
    private static class Comment {
        private String name;
        private String comment;
        private String date;

        Comment(String newName, String newComment) {
            name = newName;
            comment = newComment;

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("LLL dd, yyyy HH:mm:ss");  
            LocalDateTime now = LocalDateTime.now();  
            date = dtf.format(now);  
        }

        /** @return a formatted string with all of the comment information. */
        public String toString() {
            return name + ": " + comment + " (" + date +")";
        }
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String name = request.getParameter("name");
        String comment = request.getParameter("comment");

        Comment entry = new Comment(name, comment);

        allComments.add(entry);
        response.sendRedirect("/index.html");
        return;
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String allCommentsAsStrings = getCommentsAsStrings();
        response.setContentType("text/html;");
        response.getWriter().println(allCommentsAsStrings);
    }

    /**
    * @return a string of all the properly formatted comments to be directly added to the HTML file.
    */
    private String getCommentsAsStrings() {
        StringBuffer buffer = new StringBuffer();

        for (Comment comment : allComments) {
            buffer.append("<br><p class=\"comment-style-1\">");
            buffer.append(comment.name);
            buffer.append("</p><br><p class=\"comment-style-2\">");
            buffer.append(comment.comment);
            buffer.append("<br>(");
            buffer.append(comment.date);
            
            buffer.append(")</p><br><hr> ");
        }

        return buffer.toString();
    }
}
