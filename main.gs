/*
 * Author: Ravi Kiran Boggavarapu
 * Copyright (C) 2021 Ravi Kiran Boggavarapu
 * Do not use this software if you don't know what you are doing.
 * This software can modify and/or delete all your emails and documents.
 * This software comes as it is. No guarantee whatsoever is given. 
 * The author cannot be held responable for any misunderstanding, incorrect use, 
 * false scientific conclusions or other problems following this software.
 */
function sender_list() {
    /*
     * Make a 'paged' call to prevent overflow.
     * https://developers.google.com/apps-script/reference/gmail/gmail-app#getinboxthreads 
     */
    var thread_index = 0;
    var bucket_size = 100;

    var unique_senders = new Set();
    var inbox_threads = GmailApp.getInboxThreads(thread_index, bucket_size);

    /*
     * GCP only allows 6 minutes of execution time.
     */
    while (thread_index < 1000) {
        for (var t = 0; t < inbox_threads.length; t++) {
            var messages = inbox_threads[t].getMessages();
            for (var m = 0; m < messages.length; m++) {
                var sender = messages[m].getFrom();
                unique_senders.add(sender);
            }
        }

        thread_index += bucket_size;
        inbox_threads = GmailApp.getInboxThreads(thread_index, bucket_size);
    }

    /*
     * Create a new document on Google Docs and copy paste the URL inside the quotations below.
     */
    var doc = DocumentApp.openByUrl("");
    var body = doc.getBody();
    // Uncomment the following line to erase all the contents of the document before appending.
    // body.clear();
    for (let [key, value] of unique_senders.entries()) {
        body.appendParagraph(key);
    }
}