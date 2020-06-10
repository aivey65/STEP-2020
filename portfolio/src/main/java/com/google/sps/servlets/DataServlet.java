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
import com.google.gson.Gson;
import java.io.IOException;
import java.time.format.DateTimeFormatter;  
import java.time.ZonedDateTime;   
import java.time.ZoneId;   
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
    final private ArrayList<Comment> allComments = new ArrayList<Comment>();

    /**
    * Class to organize comments for more detailed displays. By creating 
    * another class, adding new parameters and information to keep track 
    * of may be easier.
    */
    private static class Comment {
        private String name;
        private String comment;
        private ZonedDateTime date;

        Comment(String newName, String newComment) {
            name = newName;
            comment = newComment;
            date = getDateTime(); 
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
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Gson gson = new Gson();
        String commentJsonString = gson.toJson(allComments);
        String retrieveTimeJsonString = gson.toJson(getDateTime());

        String dataResponse = "{\"commentArray\":" + commentJsonString 
                            + ",\"retrieveTime\":" + retrieveTimeJsonString
                            + "}";
        response.setContentType("application/json");
        response.getWriter().println(dataResponse);
    }

    /* Returns current time in UTC */
    private static ZonedDateTime getDateTime() {
        return ZonedDateTime.now(ZoneId.of("UTC")); 
    }
}
